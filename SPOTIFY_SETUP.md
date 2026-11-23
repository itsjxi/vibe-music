# Spotify setup

Kinetic uses the **Authorization Code flow with PKCE**, which is built for browser apps.
You only need a **Client ID**. There is no client secret, and you should never put one in a frontend `.env`.

## 1. Create a Spotify app

1. Open the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and click **Create app**.
2. Under **Redirect URIs**, add:
   - `http://127.0.0.1:5173/callback` for local development (Spotify requires the loopback IP, not `localhost`)
   - `https://<your-domain>/callback` for production
3. Under **APIs used**, tick **Web API**.
4. Copy the **Client ID**.

## 2. Configure the app

```bash
cp .env.example .env
```

```
VITE_SPOTIFY_CLIENT_ID=<your client id>
VITE_PROD_URL=https://<your-domain>
```

Run `npm run dev` and open **http://127.0.0.1:5173**, not `localhost`. The redirect URI has to match exactly.

## 3. Development-mode access

New Spotify apps start in **development mode**. Only Spotify accounts you add under
**User Management** in the dashboard can sign in. Everyone else can use **Try the demo**,
which runs on bundled data without any Spotify account.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `INVALID_CLIENT: Invalid redirect URI` | The URI in the dashboard must match exactly, including `127.0.0.1` vs `localhost` and the trailing path |
| Sign-in succeeds but the Home page is empty | The account has no listening history yet. Top tracks and recently played need some activity |
| `403` after signing in | The account isn't in the app's User Management list (development mode) |
