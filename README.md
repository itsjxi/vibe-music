# Vibe Music

A Spotify-style music streaming web app built on the Spotify Web API, with a client-side OAuth 2.0 (PKCE) flow, a persistent player, and a fully routed SPA.

**Live demo:** https://vibes-stream.netlify.app

---

## Highlights

- **OAuth 2.0 Authorization Code + PKCE, entirely in the browser.** No backend and no client secret. The app generates the code verifier and challenge, handles the callback, exchanges the code for a token, and stores it with expiry awareness (`utils/secureStorage`), so stale tokens are discarded automatically.
- **Player with a global queue.** Play, pause, next, previous, seek, and an upcoming-tracks queue. Player state lives in a Redux Toolkit slice, so playback keeps going while you move between routes.
- **Search across tracks, albums and artists**, with drill-down pages for album tracks and artist top tracks.
- **Library, Liked Songs, Playlists, Discover and Profile pages**, gated by a `ProtectedRoute`.
- **Demo mode.** Local demo data lets the UI work without a Spotify login, which helps reviewers who only want to look around.
- **Draggable mini-player** built with Framer Motion.

## Architecture

```
src/
├── features/            Redux Toolkit slices: auth, player, ui
├── hooks/               useSpotifyData: data fetching and caching for Web API calls
├── components/
│   ├── auth/            ProtectedRoute
│   ├── layout/          Header, Sidebar
│   └── player/          AudioPlayer, SpotifyPlayer, DraggablePlayer
├── pages/               Route-level screens (home, search, playlist, library, liked, discover, profile)
├── utils/               secureStorage (token storage), performance helpers
└── data/                Demo data for unauthenticated mode
```

**Key decisions**

| Decision | Why |
|---|---|
| PKCE instead of the implicit grant | The implicit grant is deprecated. PKCE is the current recommendation for public clients that can't hold a secret. |
| Redux Toolkit for player and auth | Several distant components (header, sidebar, footer player, pages) read and change the same playback state. |
| Route-level pages plus shared layout | Keeps the player and navigation mounted across navigation, so audio isn't interrupted. |

## Tech stack

React 18 · Vite · Redux Toolkit · React Router · Framer Motion · Axios · Spotify Web API

## Getting started

```bash
git clone https://github.com/itsjxi/vibe-music.git
cd vibe-music
npm install
cp .env.example .env     # add your Spotify Client ID
npm run dev
```

You need a Spotify developer app, with `http://localhost:5173/callback` added as a Redirect URI. See [SPOTIFY_SETUP.md](./SPOTIFY_SETUP.md) and [SECURITY.md](./SECURITY.md).

| Variable | Description |
|---|---|
| `VITE_SPOTIFY_CLIENT_ID` | Client ID of your Spotify app |
| `VITE_PROD_URL` | Deployed origin, used to build the redirect URI |

## Roadmap

- Remove the legacy `screens/` tree now that `pages/` replaces it
- Migrate data fetching to TanStack Query for caching and request deduplication
- Add unit tests for the auth slice and the PKCE helpers
