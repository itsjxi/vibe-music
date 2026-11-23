import { describe, it, expect } from 'vitest';
import {
  mapTrack, unwrapTracks, mapPlaylist, mapArtist, mapUser, mapSearchResults, colorFor,
} from '../services/spotifyMappers';

const track = (id, extra = {}) => ({
  id, name: `Song ${id}`, artists: [{ id: 'a', name: 'Artist' }], album: { id: 'al', name: 'Album', images: [] }, ...extra,
});

describe('spotifyMappers', () => {
  it('gives tracks without artwork a placeholder image', () => {
    expect(mapTrack(track('1')).album.images[0].url).toContain('picsum.photos');
  });

  it('drops null and local tracks without an id', () => {
    expect(unwrapTracks([{ track: track('1') }, { track: null }, { track: { name: 'local file' } }])).toHaveLength(1);
  });

  it('maps a playlist into the shape the UI renders', () => {
    const pl = mapPlaylist(
      { id: 'p1', name: 'Focus', description: 'Deep <a href="#">work</a>', images: [], tracks: { total: 40 } },
      [{ track: track('1') }],
    );
    expect(pl.description).toBe('Deep work');
    expect(pl.tracks.total).toBe(40);
    expect(pl.tracks.items[0].track.id).toBe('1');
    expect(pl.color).toBe(colorFor('p1'));
  });

  it('fills missing artist fields', () => {
    expect(mapArtist({ id: 'x', name: 'X' })).toMatchObject({ followers: { total: 0 }, genres: [] });
  });

  it('maps the profile', () => {
    expect(mapUser({ id: 'u1', display_name: null, email: 'a@b.c' })).toMatchObject({ displayName: 'u1', email: 'a@b.c' });
  });

  it('tolerates null items in search results (Spotify returns them)', () => {
    const res = mapSearchResults({ playlists: { items: [null, { id: 'p', name: 'P', images: [] }] } });
    expect(res.playlists.items).toHaveLength(1);
    expect(res.tracks.items).toEqual([]);
  });
});
