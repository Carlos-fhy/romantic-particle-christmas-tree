import React, { useRef, useEffect } from 'react';
import { Particle, TreeMode } from '../types';
import { COLORS, TRUNK_COLORS, MAX_PARTICLES } from '../constants';

interface TreeCanvasProps {
  mode: TreeMode;
  isRotatingFast: boolean;
}

const TreeCanvas: React.FC<TreeCanvasProps> = ({ mode, isRotatingFast }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let rotationAngle = 0;
    let globalTime = 0; 

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(); 
    };

    const getModeColors = () => COLORS[mode];
    const getTrunkColors = () => TRUNK_COLORS[mode];

    const initParticles = () => {
      particles = [];
      const colors = getModeColors();
      const trunkColors = getTrunkColors();
      
      const screenH = window.innerHeight;
      
      // Tree dimensions
      const treeHeight = Math.min(screenH * 0.85, 900);
      const baseRadius = treeHeight * 0.35; 
      
      // Core dimensions
      const coreHeight = treeHeight * 0.9;
      const coreRadius = baseRadius * 0.12;
      
      // Distribution
      const foliageCount = Math.floor(MAX_PARTICLES * 0.60);
      const ribbonCount = Math.floor(MAX_PARTICLES * 0.15);
      const coreCount = Math.floor(MAX_PARTICLES * 0.15);
      const orbiterCount = Math.floor(MAX_PARTICLES * 0.05);
      const dustCount = MAX_PARTICLES - foliageCount - ribbonCount - coreCount - orbiterCount;

      // --- 1. The Foliage (Main Body) ---
      const rotations = 9; 
      for (let i = 0; i < foliageCount; i++) {
        const p = i / foliageCount; 
        const hNorm = Math.pow(p, 0.9); 
        const y = -treeHeight + (hNorm * treeHeight);
        const r = hNorm * baseRadius;
        const angle = p * Math.PI * 2 * rotations + Math.random() * 0.5; 
        const spread = (Math.random() - 0.5) * (r * 0.3 + 10); 
        const x = Math.cos(angle) * (r + spread);
        const z = Math.sin(angle) * (r + spread);

        let isOrnament = false;
        if (mode === TreeMode.CLASSIC) isOrnament = Math.random() < 0.06;
        else isOrnament = Math.random() < 0.04;
        
        let color = colors[Math.floor(Math.random() * colors.length)];
        let radiusSize = Math.random() * 1.5 + 0.5;
        let opacity = Math.random() * 0.5 + 0.3;
        
        if (isOrnament) {
          radiusSize = Math.random() * 2.5 + 2.0;
          opacity = 1.0;
          if (mode === TreeMode.CLASSIC) color = '#D32F2F';
          else if (mode === TreeMode.FROZEN) color = '#7B1FA2';
          else if (mode === TreeMode.NEON) color = '#FFFFFF';
        }

        particles.push({
          x, y, z,
          radius: radiusSize,
          color,
          originalColor: color,
          speed: 0,
          angle,
          yVelocity: 0,
          opacity,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2
        });
      }

      // --- 2. The Glowing Ribbon ---
      const ribbonRotations = 5; 
      for (let i = 0; i < ribbonCount; i++) {
        const p = i / ribbonCount;
        const hNorm = p; 
        const y = -treeHeight + (hNorm * treeHeight);
        const r = hNorm * baseRadius * 1.05; 
        const angle = p * Math.PI * 2 * ribbonRotations; 
        const widthScatter = (Math.random() - 0.5) * 8; 

        const x = Math.cos(angle) * (r + widthScatter);
        const z = Math.sin(angle) * (r + widthScatter);

        let color = colors[0]; 
        if (mode === TreeMode.CLASSIC) color = '#FFFACD'; 

        particles.push({
          x, y, z,
          radius: Math.random() * 1.2 + 0.8,
          color,
          originalColor: color,
          speed: 0,
          angle,
          yVelocity: 0,
          opacity: 0.9,
          twinkleSpeed: 0.05, 
          twinklePhase: Math.random() * Math.PI * 2
        });
      }

      // --- 3. The Glowing Core ---
      for (let i = 0; i < coreCount; i++) {
        const p = i / coreCount;
        const y = -coreHeight + (p * coreHeight);
        const r = coreRadius * (0.6 + 0.4 * p) * Math.sqrt(Math.random()); 
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        const color = trunkColors[Math.floor(Math.random() * trunkColors.length)];

        particles.push({
          x, y, z,
          radius: Math.random() * 1.5 + 1.0, 
          color,
          originalColor: color,
          speed: 0,
          angle,
          yVelocity: 0,
          opacity: 0.8,
          twinkleSpeed: 0.01,
          twinklePhase: Math.random() * Math.PI
        });
      }

      // --- 4. Orbiting Sprites ---
      for (let i = 0; i < orbiterCount; i++) {
        const y = -Math.random() * treeHeight;
        const r = baseRadius * (1.2 + Math.random() * 0.8); 
        const startAngle = Math.random() * Math.PI * 2;
        
        particles.push({
          x: 0, y: 0, z: 0, 
          radius: Math.random() * 1.5 + 1.0,
          color: mode === TreeMode.CLASSIC ? '#FFD700' : colors[1],
          originalColor: colors[1],
          speed: 0,
          angle: startAngle,
          yVelocity: (Math.random() - 0.5) * 0.5, 
          opacity: Math.random() * 0.5 + 0.5,
          twinkleSpeed: 0.03,
          twinklePhase: Math.random() * Math.PI,
          isOrbiter: true,
          orbitRadius: r,
          orbitSpeed: (Math.random() * 0.01 + 0.005) * (Math.random() < 0.5 ? 1 : -1), 
          orbitYOffset: y
        });
      }

      // --- 5. Floating Dust ---
      for (let i = 0; i < dustCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * baseRadius * 1.5;
          const x = Math.cos(angle) * dist;
          const z = Math.sin(angle) * dist;
          
          particles.push({
              x, 
              y: Math.random() * -treeHeight * 0.5, 
              z,
              radius: Math.random() * 1.0,
              color: colors[0], 
              originalColor: colors[0],
              speed: 0, 
              angle, 
              yVelocity: Math.random() * 0.5 + 0.2, 
              opacity: Math.random() * 0.5, 
              twinkleSpeed: 0.01,
              twinklePhase: Math.random() * Math.PI
          });
      }
    };

    const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, breathe: number) => {
      let rot = Math.PI / 2 * 3;
      let x = cx;
      let y = cy;
      let step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      
      const glowColor = mode === TreeMode.CLASSIC ? "#FFA000" : (mode === TreeMode.FROZEN ? "#00FFFF" : "#FF00FF");
      ctx.fillStyle = "#FFFBE6"; 
      ctx.shadowBlur = 40 * breathe; // Breathing glow
      ctx.shadowColor = glowColor; 
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const render = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const screenH = window.innerHeight;
      const verticalOffset = screenH * 0.85; 

      // Breathing Factor (Sine wave)
      const breathe = 1 + Math.sin(globalTime * 2) * 0.1;

      // Enhanced Floor Glow with Breathe
      const glowRadius = Math.min(canvas.width, canvas.height) * 0.45 * breathe;
      const gradient = ctx.createRadialGradient(centerX, verticalOffset, 0, centerX, verticalOffset, glowRadius);
      let floorColor = "rgba(255, 215, 0, 0.18)";
      if (mode === TreeMode.FROZEN) floorColor = "rgba(0, 255, 255, 0.15)";
      if (mode === TreeMode.NEON) floorColor = "rgba(255, 0, 255, 0.15)";
      
      gradient.addColorStop(0, floorColor);
      gradient.addColorStop(0.5, floorColor.replace(/[^,]+(?=\))/, '0.05')); 
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.save();
      ctx.translate(centerX, verticalOffset);
      ctx.scale(1, 0.25); 
      ctx.beginPath();
      ctx.arc(0, 0, glowRadius, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();

      ctx.globalCompositeOperation = 'lighter';

      const baseSpeed = 0.002; 
      const speedMultiplier = isRotatingFast ? 6 : 1;
      rotationAngle -= baseSpeed * speedMultiplier; 
      globalTime += 0.01;

      particles.forEach(p => {
        if (p.isOrbiter && p.orbitRadius && p.orbitSpeed) {
           const currentOrbitAngle = p.angle + (globalTime * p.orbitSpeed * 100); 
           p.x = Math.cos(currentOrbitAngle) * p.orbitRadius;
           p.z = Math.sin(currentOrbitAngle) * p.orbitRadius;
           p.y = (p.orbitYOffset || 0) + Math.sin(globalTime + p.angle) * 20; 
        }
      });

      particles.sort((a, b) => {
        const az = a.z * Math.cos(rotationAngle) - a.x * Math.sin(rotationAngle);
        const bz = b.z * Math.cos(rotationAngle) - b.x * Math.sin(rotationAngle);
        return az - bz; 
      });

      particles.forEach((p) => {
        if (!p.isOrbiter && p.yVelocity > 0) {
            p.y -= p.yVelocity; 
            if (p.y < -900) {
                p.y = 0;
                p.opacity = 0;
            }
        }

        const cosRot = Math.cos(rotationAngle);
        const sinRot = Math.sin(rotationAngle);
        const rx = p.x * cosRot + p.z * sinRot;
        const rz = p.z * cosRot - p.x * sinRot;
        
        const fov = 400; 
        const scale = fov / (fov + rz + 400); 
        const x2d = rx * scale + centerX;
        const y2d = p.y * scale + verticalOffset;

        if (scale < 0) return; 

        p.twinklePhase += p.twinkleSpeed;
        const twinkle = (Math.sin(p.twinklePhase) + 1) / 2; 
        
        let alpha = p.opacity;
        if (p.isOrbiter) {
            alpha = p.opacity; 
        } else if (p.yVelocity > 0) {
            alpha = p.opacity * twinkle * 0.8;
        } else {
            alpha = Math.max(0.1, Math.min(1, p.opacity * (0.6 + 0.4 * twinkle)));
        }
        
        // Apply breathing to particle alpha
        if (!p.isOrbiter && p.yVelocity === 0) {
            alpha *= (0.9 + 0.1 * breathe);
        }

        ctx.beginPath();
        const r = p.radius * scale;
        ctx.arc(x2d, y2d, r, 0, Math.PI * 2);
        
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        
        if (!p.isOrbiter && p.opacity > 0.8 && rz > 0) {
             ctx.shadowBlur = 8 * scale * breathe; // Breathing ribbons
             ctx.shadowColor = p.color;
        }
        if (p.isOrbiter) {
             ctx.shadowBlur = 15 * scale;
             ctx.shadowColor = p.color;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      // Draw Top Star
      const treeHeight = Math.min(screenH * 0.85, 900);
      const starY = -treeHeight;
      const starRZ = 0;
      const starScale = 400 / (400 + starRZ + 400);
      const starX2d = centerX;
      const starY2d = starY * starScale + verticalOffset;

      drawStar(starX2d, starY2d, 5, 30 * starScale, 12 * starScale, breathe);

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode, isRotatingFast]); 

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full z-10 mix-blend-screen"
    />
  );
};

export default TreeCanvas;