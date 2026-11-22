// ============================================================
// AURA — Demo Music Data (no external API required)
// Uses freely available placeholder images + audio previews
// ============================================================

export const DEMO_TRACKS = [
  {
    id: 't1',
    name: 'Neon Drift',
    artists: [{ id: 'a1', name: 'Solaris' }],
    album: { id: 'al1', name: 'Deep Currents', images: [{ url: 'https://picsum.photos/seed/neon1/300/300' }] },
    duration_ms: 213000,
    preview_url: null,
    genre: 'Electronic',
    liked: true,
  },
  {
    id: 't2',
    name: 'Gravity Well',
    artists: [{ id: 'a2', name: 'Voidwalker' }],
    album: { id: 'al2', name: 'Event Horizon', images: [{ url: 'https://picsum.photos/seed/grav2/300/300' }] },
    duration_ms: 187000,
    preview_url: null,
    genre: 'Ambient',
    liked: false,
  },
  {
    id: 't3',
    name: 'Crystalline',
    artists: [{ id: 'a3', name: 'Aurora Waves' }],
    album: { id: 'al3', name: 'Prism', images: [{ url: 'https://picsum.photos/seed/crys3/300/300' }] },
    duration_ms: 243000,
    preview_url: null,
    genre: 'Chillwave',
    liked: true,
  },
  {
    id: 't4',
    name: 'Pulse (Extended)',
    artists: [{ id: 'a4', name: 'Hex Circuit' }],
    album: { id: 'al4', name: 'Binary Sunset', images: [{ url: 'https://picsum.photos/seed/puls4/300/300' }] },
    duration_ms: 328000,
    preview_url: null,
    genre: 'Techno',
    liked: false,
  },
  {
    id: 't5',
    name: 'Distant Signals',
    artists: [{ id: 'a5', name: 'Nova Cascade' }],
    album: { id: 'al5', name: 'Starfield', images: [{ url: 'https://picsum.photos/seed/dist5/300/300' }] },
    duration_ms: 195000,
    preview_url: null,
    genre: 'Synthwave',
    liked: true,
  },
  {
    id: 't6',
    name: 'Mirage',
    artists: [{ id: 'a1', name: 'Solaris' }],
    album: { id: 'al1', name: 'Deep Currents', images: [{ url: 'https://picsum.photos/seed/mira6/300/300' }] },
    duration_ms: 221000,
    preview_url: null,
    genre: 'Electronic',
    liked: false,
  },
  {
    id: 't7',
    name: 'Infinite Room',
    artists: [{ id: 'a6', name: 'Lunar Static' }],
    album: { id: 'al6', name: 'Null Space', images: [{ url: 'https://picsum.photos/seed/inf7/300/300' }] },
    duration_ms: 267000,
    preview_url: null,
    genre: 'Lo-Fi',
    liked: true,
  },
  {
    id: 't8',
    name: 'Resonance',
    artists: [{ id: 'a7', name: 'Chromatic Void' }],
    album: { id: 'al7', name: 'Resonance LP', images: [{ url: 'https://picsum.photos/seed/reso8/300/300' }] },
    duration_ms: 302000,
    preview_url: null,
    genre: 'Experimental',
    liked: false,
  },
  {
    id: 't9',
    name: 'Falling Upward',
    artists: [{ id: 'a8', name: 'Skyfield' }],
    album: { id: 'al8', name: 'Altitude', images: [{ url: 'https://picsum.photos/seed/fall9/300/300' }] },
    duration_ms: 178000,
    preview_url: null,
    genre: 'Indie',
    liked: false,
  },
  {
    id: 't10',
    name: 'Deep Frequency',
    artists: [{ id: 'a2', name: 'Voidwalker' }],
    album: { id: 'al2', name: 'Event Horizon', images: [{ url: 'https://picsum.photos/seed/deep10/300/300' }] },
    duration_ms: 351000,
    preview_url: null,
    genre: 'Ambient',
    liked: true,
  },
  {
    id: 't11',
    name: 'Hyperlight',
    artists: [{ id: 'a3', name: 'Aurora Waves' }],
    album: { id: 'al3', name: 'Prism', images: [{ url: 'https://picsum.photos/seed/hyp11/300/300' }] },
    duration_ms: 209000,
    preview_url: null,
    genre: 'Chillwave',
    liked: false,
  },
  {
    id: 't12',
    name: 'Stardust Protocol',
    artists: [{ id: 'a4', name: 'Hex Circuit' }],
    album: { id: 'al4', name: 'Binary Sunset', images: [{ url: 'https://picsum.photos/seed/star12/300/300' }] },
    duration_ms: 284000,
    preview_url: null,
    genre: 'Techno',
    liked: true,
  },
];

export const DEMO_PLAYLISTS = [
  {
    id: 'p1',
    name: 'Spatial Vibes',
    description: 'Deep electronic landscapes for late nights',
    images: [{ url: 'https://picsum.photos/seed/pl1/400/400' }],
    tracks: { total: 24, items: DEMO_TRACKS.slice(0, 6).map(t => ({ track: t })) },
    owner: { display_name: 'Aura' },
    color: '#7c3aed',
  },
  {
    id: 'p2',
    name: 'Zero Gravity',
    description: 'Floating ambient soundscapes',
    images: [{ url: 'https://picsum.photos/seed/pl2/400/400' }],
    tracks: { total: 18, items: DEMO_TRACKS.slice(2, 8).map(t => ({ track: t })) },
    owner: { display_name: 'Aura' },
    color: '#3b82f6',
  },
  {
    id: 'p3',
    name: 'Neon Pulse',
    description: 'High-energy electronic beats',
    images: [{ url: 'https://picsum.photos/seed/pl3/400/400' }],
    tracks: { total: 31, items: DEMO_TRACKS.slice(3, 9).map(t => ({ track: t })) },
    owner: { display_name: 'Aura' },
    color: '#06b6d4',
  },
  {
    id: 'p4',
    name: 'Dark Matter',
    description: 'Experimental textures from the void',
    images: [{ url: 'https://picsum.photos/seed/pl4/400/400' }],
    tracks: { total: 15, items: DEMO_TRACKS.slice(5, 11).map(t => ({ track: t })) },
    owner: { display_name: 'Aura' },
    color: '#f43f5e',
  },
  {
    id: 'p5',
    name: 'Lo-Fi Cosmos',
    description: 'Chill beats for focused minds',
    images: [{ url: 'https://picsum.photos/seed/pl5/400/400' }],
    tracks: { total: 42, items: DEMO_TRACKS.slice(6, 12).map(t => ({ track: t })) },
    owner: { display_name: 'Aura' },
    color: '#f59e0b',
  },
  {
    id: 'p6',
    name: 'Hyperdrive',
    description: 'Fast-paced techno for motion',
    images: [{ url: 'https://picsum.photos/seed/pl6/400/400' }],
    tracks: { total: 27, items: DEMO_TRACKS.slice(0, 8).map(t => ({ track: t })) },
    owner: { display_name: 'Aura' },
    color: '#10b981',
  },
];

export const DEMO_ARTISTS = [
  { id: 'a1', name: 'Solaris',        followers: { total: 142500 }, genres: ['Electronic', 'Ambient'], images: [{ url: 'https://picsum.photos/seed/ar1/300/300' }] },
  { id: 'a2', name: 'Voidwalker',     followers: { total: 89200 },  genres: ['Ambient', 'Drone'],      images: [{ url: 'https://picsum.photos/seed/ar2/300/300' }] },
  { id: 'a3', name: 'Aurora Waves',   followers: { total: 231000 }, genres: ['Chillwave', 'Shoegaze'], images: [{ url: 'https://picsum.photos/seed/ar3/300/300' }] },
  { id: 'a4', name: 'Hex Circuit',    followers: { total: 55400 },  genres: ['Techno', 'Industrial'],  images: [{ url: 'https://picsum.photos/seed/ar4/300/300' }] },
  { id: 'a5', name: 'Nova Cascade',   followers: { total: 178900 }, genres: ['Synthwave', 'Retro'],    images: [{ url: 'https://picsum.photos/seed/ar5/300/300' }] },
  { id: 'a6', name: 'Lunar Static',   followers: { total: 67300 },  genres: ['Lo-Fi', 'Jazz'],         images: [{ url: 'https://picsum.photos/seed/ar6/300/300' }] },
];

export const DEMO_RECENTLY_PLAYED = DEMO_TRACKS.slice(0, 8);
export const DEMO_TOP_TRACKS = [...DEMO_TRACKS].reverse().slice(0, 8);
export const DEMO_LIKED_SONGS = DEMO_TRACKS.filter(t => t.liked);

// Simple search function
export const searchDemoData = (query) => {
  const q = query.toLowerCase();
  return {
    tracks: {
      items: DEMO_TRACKS.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.artists.some(a => a.name.toLowerCase().includes(q)) ||
        t.album.name.toLowerCase().includes(q)
      ),
    },
    artists: {
      items: DEMO_ARTISTS.filter(a =>
        a.name.toLowerCase().includes(q)
      ),
    },
    albums: {
      items: DEMO_TRACKS.filter(t =>
        t.album.name.toLowerCase().includes(q)
      ).map(t => t.album),
    },
    playlists: {
      items: DEMO_PLAYLISTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      ),
    },
  };
};
