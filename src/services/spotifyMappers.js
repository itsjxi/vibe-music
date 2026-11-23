// Normalise Spotify Web API objects into the shapes the UI already renders
// (the same shapes as data/demoData.js), so pages don't care where data came from.

const PALETTE = ['#7c3aed', '#3b82f6', '#06b6d4', '#f43f5e', '#f59e0b', '#10b981'];
const FALLBACK_IMAGE = (seed) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/300/300`;

export const colorFor = (id = '') =>
  PALETTE[[...String(id)].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % PALETTE.length];

const withImages = (images, seed) => (images?.length ? images : [{ url: FALLBACK_IMAGE(seed) }]);

const stripHtml = (text = '') => text.replace(/<[^>]*>/g, '').trim();

export const mapTrack = (track) => {
  if (!track?.id) return null;
  return {
    ...track,
    album: { ...track.album, images: withImages(track.album?.images, track.id) },
    artists: track.artists ?? [],
    genre: track.genre ?? '',
  };
};

export const mapTracks = (tracks = []) => tracks.map(mapTrack).filter(Boolean);

// Spotify wraps tracks as { track } in playlists, saved tracks and recently played
export const unwrapTracks = (items = []) => mapTracks(items.map((i) => i?.track ?? i));

export const mapPlaylist = (playlist, trackItems = []) => ({
  id: playlist.id,
  name: playlist.name,
  description: stripHtml(playlist.description),
  images: withImages(playlist.images, playlist.id),
  owner: playlist.owner ?? { display_name: 'Spotify' },
  color: colorFor(playlist.id),
  tracks: {
    total: playlist.tracks?.total ?? trackItems.length,
    items: unwrapTracks(trackItems).map((track) => ({ track })),
  },
});

export const mapArtist = (artist) => ({
  ...artist,
  images: withImages(artist.images, artist.id),
  followers: { total: artist.followers?.total ?? 0 },
  genres: artist.genres ?? [],
});

export const mapUser = (profile) => ({
  id: profile.id,
  displayName: profile.display_name || profile.id,
  email: profile.email ?? '',
  images: profile.images ?? [],
  country: profile.country,
  product: profile.product,
});

export const mapSearchResults = (data = {}) => ({
  tracks: { items: mapTracks(data.tracks?.items) },
  artists: { items: (data.artists?.items ?? []).filter(Boolean).map(mapArtist) },
  albums: {
    items: (data.albums?.items ?? []).filter(Boolean).map((a) => ({ ...a, images: withImages(a.images, a.id) })),
  },
  playlists: { items: (data.playlists?.items ?? []).filter(Boolean).map((p) => mapPlaylist(p)) },
});
