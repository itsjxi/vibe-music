# Kinetic

[![CI](https://github.com/itsjxi/vibe-music/actions/workflows/ci.yml/badge.svg)](https://github.com/itsjxi/vibe-music/actions/workflows/ci.yml)

A music app built on the Spotify Web API. Sign in with Spotify to browse **your own** playlists, liked songs, top tracks and artists, or try the demo mode, which runs on bundled data with no account needed.

**Live demo:** https://vibes-stream.netlify.app

---

## Highlights

- **OAuth 2.0 Authorization Code + PKCE, entirely in the browser.** There's no backend and no client secret. The code verifier and state are generated with `crypto.getRandomValues`, the state is checked on the callback, and the code is exchanged for tokens.
- **Token lifecycle.** Access tokens are treated as expired 60 seconds early. They're refreshed with the refresh token, rotated refresh tokens are stored, and concurrent refreshes share a single request. An Axios interceptor retries a `401` once after refreshing. If refresh fails, the user is signed out.
- **One data layer for two sources.** `useLibrary()` returns either the user's Spotify library or demo data in the same shape, so pages don't know or care where data comes from. Spotify responses are normalised in pure, tested mappers (`services/spotifyMappers.js`).
- **Resilient loading.** The library loads with `Promise.allSettled`, so one failing endpoint (for example, no listening history) leaves that section empty instead of breaking the app. Playlists fetch their tracks on demand.
- **Global player and queue** in Redux Toolkit, with a draggable mini-player (Framer Motion). Playback continues across routes.
- **Route-level code splitting** with `React.lazy` and `Suspense`.

## Architecture

```
src/
├── services/
│   ├── spotifyAuth.js      PKCE, callback validation, token refresh
│   ├── spotifyApi.js       Axios client with token and 401-retry interceptors
│   └── spotifyMappers.js   Spotify API → UI shapes (pure functions)
├── features/               Redux Toolkit slices: auth (demo|spotify), library, player, ui
├── hooks/                  useLibrary, usePlaylist, useMusicSearch
├── pages/                  Landing, SpotifyCallback, Home, Search, Playlist, Library, Liked, Discover, Profile
├── components/             layout, player, auth (ProtectedRoute), ui
└── data/demoData.js        Data for demo mode
```

```
Landing ──"Continue with Spotify"──▶ accounts.spotify.com (PKCE challenge)
   │                                         │
   └──"Try the demo"──▶ demo session         ▼
                                     /callback: verify state → exchange code → /me
                                             │
                                             ▼
                         loginSpotify → fetchSpotifyLibrary → /home
```

**Key decisions**

| Decision | Why |
|---|---|
| PKCE instead of the implicit grant | The implicit grant is deprecated. PKCE is the current standard for public clients that can't keep a secret. |
| Normalise API data into the demo shape | One rendering path for both modes, and the mapping logic is unit-tested without a browser. |
| `Promise.allSettled` for the library | Spotify endpoints fail independently (scopes, empty history), so partial data beats an error screen. |
| Redux for player, auth and library state | Header, sidebar, player and pages all read the same state. |

## Testing

```bash
npm test        # Vitest + Testing Library
npm run lint
```

There are 30 tests. They cover the PKCE challenge, state validation, token expiry and refresh (including concurrent refresh and failed refresh), the API mappers, the auth and library slices, and smoke renders of every page in both demo and Spotify mode. CI runs lint, tests and a production build on every push.

## Getting started

```bash
git clone https://github.com/itsjxi/vibe-music.git
cd vibe-music
npm install
npm run dev          # open http://127.0.0.1:5173
```

The demo works straight away. To enable Spotify sign-in, add your Client ID to `.env` (`cp .env.example .env`) and follow [SPOTIFY_SETUP.md](./SPOTIFY_SETUP.md).

> Spotify apps start in development mode, so only accounts added in the developer dashboard can sign in. Everyone else gets the demo.

| Variable | Description |
|---|---|
| `VITE_SPOTIFY_CLIENT_ID` | Client ID of your Spotify app. If it's missing, only demo mode is offered |
| `VITE_PROD_URL` | Deployed origin, used to build the production redirect URI |

## Roadmap

- Full-track playback with the Web Playback SDK (Premium accounts)
- Like and unlike, and playlist editing, through the API
- Migrate data fetching to TanStack Query for caching and request deduplication
