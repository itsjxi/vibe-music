 # Vibes Music - Music Streaming App
live demo: https://vibesmusic.netlify.app/


Welcome to Vibes Music! This project is a modern music streaming application built with React, featuring:
1) Genre-wise music categorization
2) Playlist and album tracks with search functionality
3) User playlist rendering based on login
4) Single page application routing
5) Working audio player with play, pause, next, previous, and queue functionalities

## Tech Stack

- **React (v18.2.0):** JavaScript library for building user interfaces.
- **Vite (v5.0.8):** A build tool that aims to provide a faster and more efficient development experience.
- **React Axios (v2.0.6):** A lightweight wrapper around Axios for making HTTP requests in React applications.
- **React Icons (v4.12.0):** A popular library for including SVG icons in React projects.
- **"react-router-dom": "^5.3.4"** implimenting single page application.

## Project Setup

Follow these guidelines to set up and run the project locally on our machine.


### 1. Install Dependencies and adding required data

#### 1.1 Clone the Repository

```bash
git clone https://github.com/itsjxi/SpotifyClone023.git
cd SpotifyClone023
npm install
```

#### 1.2 Setup Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` and add your credentials:

```
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_PROD_URL=https://vibesmusic.netlify.app
```

**Important:** Never commit your `.env` file to GitHub. It's already in `.gitignore`.

#### 1.3 Configure Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app or use existing one
3. In app settings, add these Redirect URIs:
   - `https://localhost:5173/callback` (for development)
   - `https://vibesmusic.netlify.app/callback` (for production)
4. Copy your Client ID to the `.env` file

### 2 Start the Development Server
```bash
npm run dev
```
This command starts the development server at http://localhost:5173

### 3 Open in Browser
Open your web browser and navigate to http://localhost:5173 to view the running project.

## 4. Authentication Flow

This app uses Spotify Web API with OAuth 2.0 Authorization Code Flow with PKCE:

1. User clicks "Connect Spotify"
2. Redirects to Spotify login
3. After authorization, Spotify redirects back with authorization code
4. App exchanges code for access token
5. Access token is used to fetch user data and playlists

**Security Note:** This implementation uses PKCE (Proof Key for Code Exchange) which is secure for client-side apps and doesn't require a client secret. 


## 5. Deploying to Netlify

### 5.1 Create a Netlify Account

Sign up for a Netlify account if you don't have one.

### 5.2 Configure Environment Variables on Netlify

1. Go to Site settings > Build & deploy > Environment
2. Add environment variables:
   - `VITE_SPOTIFY_CLIENT_ID`: Your Spotify Client ID
   - `VITE_PROD_URL`: `https://vibesmusic.netlify.app`

### 5.3 Connect to GitHub Repository

1. Click "New site from Git"
2. Select your GitHub repository
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### 5.4 Update Spotify App Settings

Add your Netlify URL to Spotify app's Redirect URIs:
`https://vibesmusic.netlify.app/callback`

### 5.5 Deploy

Netlify automatically triggers a build and deploys your site.

### 5.6 Access Live Site

Once the build is complete, your site will be live at https://vibesmusic.netlify.app/


