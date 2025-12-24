import { TreeMode } from './types';

export const COLORS = {
  // Classic: Champagne Gold, Warm White, Soft Amber
  [TreeMode.CLASSIC]: ['#FFD700', '#FDB813', '#FFF8DC', '#FFE4B5'], 
  // Frozen: Icy Blue, White, Cyan
  [TreeMode.FROZEN]: ['#E0F7FA', '#B2EBF2', '#FFFFFF', '#80DEEA'], 
  // Neon: Vibrant Cyberpunk
  [TreeMode.NEON]: ['#FF00FF', '#00FFFF', '#00FF00', '#FFFF00'],
};

// Internal Core/Trunk colors
export const TRUNK_COLORS = {
  // Classic: Glowing Warm Amber/Orange (Like a candle inside)
  [TreeMode.CLASSIC]: ['#FF8F00', '#FF6F00', '#FFCA28', '#FFA000'], 
  // Frozen: Deep Blue/Grey
  [TreeMode.FROZEN]: ['#455A64', '#607D8B', '#78909C', '#90A4AE'],   
  // Neon: Dark Grey
  [TreeMode.NEON]: ['#212121', '#424242', '#303030', '#000000'],     
};

// All I Want For Christmas Is You - Mariah Carey
export const AUDIO_URL = "/all-i-want-for-xmas-is-you.mp3"; 

export const TREE_HEIGHT_RATIO = 0.85; 
// Increased particle count for richer visuals (Ribbons + Orbits)
export const MAX_PARTICLES = 5500;