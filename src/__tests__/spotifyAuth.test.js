// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import SecureStorage from '../utils/secureStorage';
import {
  __test__, isTokenValid, refreshAccessToken, getValidAccessToken, parseCodeFromUrl,
} from '../services/spotifyAuth';

const { generateCodeChallenge, generateRandomString } = __test__;

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('PKCE helpers', () => {
  it('computes the S256 challenge as base64url(SHA-256(verifier)) without padding', async () => {
    // NIST SHA-256 test vector for "abc", base64url-encoded
    await expect(generateCodeChallenge('abc')).resolves.toBe('ungWv48Bz-pBQUDeXa4iI7ADYaOWF3qctBD_YfIAFa0');
  });

  it('generates random strings of the requested length from the allowed alphabet', () => {
    const value = generateRandomString(128);
    expect(value).toHaveLength(128);
    expect(value).toMatch(/^[A-Za-z0-9]+$/);
    expect(generateRandomString(32)).not.toBe(generateRandomString(32));
  });
});

describe('callback validation', () => {
  it('rejects a callback whose state does not match the one we sent', () => {
    SecureStorage.setItem('auth_state', 'expected');
    window.history.pushState({}, '', '/callback?code=abc&state=forged');
    expect(() => parseCodeFromUrl()).toThrow('State mismatch');
  });

  it('returns the code when the state matches', () => {
    SecureStorage.setItem('auth_state', 'expected');
    window.history.pushState({}, '', '/callback?code=abc&state=expected');
    expect(parseCodeFromUrl()).toBe('abc');
  });

  it('surfaces a user cancellation as an error', () => {
    window.history.pushState({}, '', '/callback?error=access_denied');
    expect(() => parseCodeFromUrl()).toThrow('access_denied');
  });
});

describe('token lifecycle', () => {
  it('treats tokens that expire within a minute as expired', () => {
    SecureStorage.setItem('access_token', 't');
    SecureStorage.setItem('token_expires', Date.now() + 30_000);
    expect(isTokenValid()).toBe(false);
    SecureStorage.setItem('token_expires', Date.now() + 10 * 60_000);
    expect(isTokenValid()).toBe(true);
  });

  it('refreshes once for concurrent callers and stores the rotated refresh token', async () => {
    SecureStorage.setItem('refresh_token', 'old-refresh');
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(
      JSON.stringify({ access_token: 'new-access', expires_in: 3600, refresh_token: 'new-refresh' }),
      { status: 200 },
    ));

    const [a, b] = await Promise.all([refreshAccessToken(), refreshAccessToken()]);

    expect(a).toBe('new-access');
    expect(b).toBe('new-access');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = fetchMock.mock.calls[0][1].body;
    expect(body.get('grant_type')).toBe('refresh_token');
    expect(body.get('refresh_token')).toBe('old-refresh');
    expect(SecureStorage.getItem('refresh_token')).toBe('new-refresh');
    expect(isTokenValid()).toBe(true);
  });

  it('signs the user out when the refresh fails', async () => {
    SecureStorage.setItem('refresh_token', 'revoked');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 400 }));
    await expect(getValidAccessToken()).resolves.toBeNull();
    expect(SecureStorage.getItem('refresh_token')).toBeNull();
  });
});
