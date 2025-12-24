export interface Point {
  x: number;
  y: number;
  z: number;
}

export interface Particle {
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  originalColor: string;
  speed: number;
  angle: number;
  yVelocity: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  // New properties for advanced effects
  isOrbiter?: boolean;
  orbitRadius?: number;
  orbitSpeed?: number;
  orbitYOffset?: number;
}

export interface SnowFlake {
  x: number;
  y: number;
  radius: number;
  density: number;
  opacity: number;
}

export enum TreeMode {
  CLASSIC = 'CLASSIC', // Warm Gold
  FROZEN = 'FROZEN', // Blue/White
  NEON = 'NEON',   // RGB
}