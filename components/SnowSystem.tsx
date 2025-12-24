import React, { useRef, useEffect } from 'react';
import { SnowFlake, TreeMode } from '../types';

interface SnowSystemProps {
  mode: TreeMode;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  angle: number;
  life: number;
}

interface TreeSilhouette {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface FireworkParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
    alpha: number;
    friction: number;
    gravity: number;
}

interface FireworkRocket {
    x: number;
    y: number;
    targetY: number;
    vy: number;
    vx: number;
    color: string;
}

interface FogParticle {
    x: number;
    y: number;
    radius: number;
    speed: number;
    opacity: number;
}

interface House {
  x: number;
  y: number;
  width: number;
  height: number;
  roofHeight: number;
  color: string;
  windowColor: string;
  hasChimney: boolean;
  windows: {x: number, y: number, w: number, h: number}[];
}

interface SmokeParticle {
  x: number;
  y: number;
  vy: number;
  life: number;
  size: number;
}

const AURORA_COLORS = {
  [TreeMode.CLASSIC]: ['rgba(16, 80, 40, 0.25)', 'rgba(80, 20, 20, 0.15)'], 
  [TreeMode.FROZEN]: ['rgba(10, 30, 100, 0.3)', 'rgba(50, 200, 255, 0.1)'], 
  [TreeMode.NEON]: ['rgba(100, 0, 150, 0.2)', 'rgba(0, 200, 200, 0.15)'],   
};

// Romantic firework colors
const FIREWORK_COLORS = [
    '#FF3F81', '#FFD700', '#00E5FF', '#7C4DFF', '#69F0AE', '#FFAB40', '#FFFFFF'
];

const SnowSystem: React.FC<SnowSystemProps> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    // Elements
    let flakes: SnowFlake[] = [];
    let stars: Star[] = [];
    let forest: TreeSilhouette[] = [];
    let houses: House[] = [];
    let smokeParticles: SmokeParticle[] = [];
    
    // Dynamic Elements
    let shootingStar: ShootingStar | null = null;
    let shootingStarTimer = 0;
    
    // Fireworks
    let rockets: FireworkRocket[] = [];
    let particles: FireworkParticle[] = [];
    let fireworkTimer = 0;
    
    // Santa
    let santaX = -500;
    let santaY = 100;
    let santaActive = false;
    let santaTimer = 0;
    
    // Aurora
    let auroraOffset = 0;

    // Fog
    let fogParticles: FogParticle[] = [];

    const mp = 150; 
    const starCount = 70; 

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initElements();
    };

    const initElements = () => {
      flakes = [];
      for (let i = 0; i < mp; i++) {
        flakes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2.5 + 1, 
          density: Math.random() * mp,
          opacity: Math.random() * 0.4 + 0.1
        });
      }

      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.7, 
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random(),
          twinkleSpeed: Math.random() * 0.02 + 0.005
        });
      }

      forest = [];
      const treeCount = Math.floor(canvas.width / 10);
      for(let i=0; i < treeCount; i++) {
          const h = 40 + Math.random() * 60; 
          const w = 15 + Math.random() * 10;
          const x = i * 10 + (Math.random() - 0.5) * 10;
          const y = canvas.height;
          const color = "rgba(5, 10, 20, 0.6)"; 
          forest.push({ x, y, width: w, height: h, color });
      }

      houses = [];
      const houseSpacing = 120;
      const houseCount = Math.floor(canvas.width / houseSpacing) + 2;
      for (let i = 0; i < houseCount; i++) {
          if (Math.random() > 0.7) continue; 
          const x = i * houseSpacing + (Math.random() - 0.5) * 40;
          const y = canvas.height;
          const w = 50 + Math.random() * 30;
          const h = 30 + Math.random() * 25;
          const roofH = 15 + Math.random() * 10;
          const windows = [];
          const rows = Math.floor(h / 18);
          const cols = Math.floor(w / 18);
          for(let r=0; r<rows; r++) {
              for(let c=0; c<cols; c++) {
                  if (Math.random() > 0.2) {
                      windows.push({
                          x: 6 + c * 16,
                          y: 8 + r * 16,
                          w: 8,
                          h: 10
                      });
                  }
              }
          }
          houses.push({
              x, y, width: w, height: h, roofHeight: roofH,
              color: '#0d1117',
              windowColor: mode === TreeMode.NEON ? '#FF00FF' : (mode === TreeMode.FROZEN ? '#E0F7FA' : '#FFD54F'),
              hasChimney: Math.random() > 0.3,
              windows
          });
      }

      fogParticles = [];
      for (let i = 0; i < 20; i++) {
          fogParticles.push({
              x: Math.random() * canvas.width,
              y: canvas.height - Math.random() * 150,
              radius: Math.random() * 100 + 50,
              speed: (Math.random() - 0.5) * 0.2,
              opacity: Math.random() * 0.1 + 0.05
          });
      }
      
      smokeParticles = [];
    };

    const spawnShootingStar = () => {
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * (canvas.height * 0.3);
        const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2; 
        shootingStar = {
            x: startX,
            y: startY,
            length: Math.random() * 80 + 50,
            speed: Math.random() * 10 + 15,
            opacity: 1,
            angle: angle,
            life: 60 
        };
    };

    const launchFirework = () => {
        const x = Math.random() * canvas.width;
        const targetY = canvas.height * 0.1 + Math.random() * (canvas.height * 0.4); 
        rockets.push({
            x,
            y: canvas.height,
            vx: (Math.random() - 0.5) * 2,
            targetY,
            vy: -10 - Math.random() * 5,
            color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)]
        });
    };

    const explodeFirework = (x: number, y: number, color: string) => {
        const particleCount = 80 + Math.floor(Math.random() * 40);
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 2;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                color,
                alpha: 1,
                friction: 0.95 + Math.random() * 0.03,
                gravity: 0.08 + Math.random() * 0.05
            });
        }
    };

    const drawAurora = () => {
        const colors = AURORA_COLORS[mode];
        const w = canvas.width;
        const h = canvas.height;
        auroraOffset += 0.002;
        const g1 = ctx.createRadialGradient(w * 0.3 + Math.sin(auroraOffset) * 100, h * -0.2, 0, w * 0.3, h * 0.2, w * 0.8);
        g1.addColorStop(0, colors[0]);
        g1.addColorStop(1, 'rgba(0,0,0,0)');
        const g2 = ctx.createRadialGradient(w * 0.8 - Math.sin(auroraOffset * 0.8) * 100, h * -0.1, 0, w * 0.8, h * 0.3, w * 0.6);
        g2.addColorStop(0, colors[1]);
        g2.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'source-over';
    };

    const drawFog = () => {
        ctx.globalCompositeOperation = 'screen';
        fogParticles.forEach(fog => {
            fog.x += fog.speed;
            if (fog.x > canvas.width + fog.radius) fog.x = -fog.radius;
            if (fog.x < -fog.radius) fog.x = canvas.width + fog.radius;
            const g = ctx.createRadialGradient(fog.x, fog.y, 0, fog.x, fog.y, fog.radius);
            const color = mode === TreeMode.CLASSIC ? "100, 100, 150" : (mode === TreeMode.FROZEN ? "200, 250, 255" : "100, 0, 100");
            g.addColorStop(0, `rgba(${color}, ${fog.opacity})`);
            g.addColorStop(1, `rgba(${color}, 0)`);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(fog.x, fog.y, fog.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalCompositeOperation = 'source-over';
    };

    const drawSanta = () => {
        if (!santaActive) {
            santaTimer++;
            if (santaTimer > 1500) { 
                santaActive = true;
                santaX = -200;
                santaY = canvas.height * 0.15 + Math.random() * 100;
                santaTimer = 0;
            }
            return;
        }
        santaX += 3;
        const currentY = santaY + Math.sin(santaX * 0.01) * 30; 
        for(let i=0; i<9; i++) {
            const rx = santaX + i * 15;
            const ry = currentY + Math.sin((santaX + i * 10) * 0.05) * 5;
            ctx.beginPath();
            ctx.arc(rx, ry, i === 8 ? 3 : 2, 0, Math.PI * 2); 
            ctx.shadowBlur = 10;
            if (i === 8) { 
                ctx.fillStyle = "#FF0000";
                ctx.shadowColor = "#FF0000";
            } else {
                ctx.fillStyle = "#FFF8DC"; 
                ctx.shadowColor = "#FFFFFF";
            }
            ctx.fill();
            if (Math.random() < 0.3) {
                 ctx.fillStyle = `rgba(255, 215, 0, ${Math.random()})`;
                 ctx.fillRect(rx - 5 - Math.random()*20, ry, 1, 1);
            }
        }
        const sleighX = santaX - 40;
        const sleighY = currentY;
        ctx.beginPath();
        ctx.ellipse(sleighX, sleighY, 12, 6, 0, 0, Math.PI*2);
        ctx.fillStyle = "#D4AF37"; 
        ctx.shadowColor = "#D4AF37";
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
        if (santaX > canvas.width + 200) santaActive = false;
    };

    const drawFireworks = () => {
        // Random Trigger
        fireworkTimer++;
        if (fireworkTimer > 80 && Math.random() < 0.015) { 
             launchFirework();
             fireworkTimer = 0;
        }

        // Handle Rockets (Rising phase)
        for (let i = rockets.length - 1; i >= 0; i--) {
            const r = rockets[i];
            r.x += r.vx;
            r.y += r.vy;
            r.vy += 0.05; // Air resistance/Gravity for rocket

            ctx.globalAlpha = 0.8;
            ctx.fillStyle = r.color;
            ctx.beginPath();
            ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Sparkling trail
            if (Math.random() < 0.4) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(r.x + (Math.random()-0.5)*4, r.y + 2, 1, 1);
            }

            if (r.vy >= 0 || r.y <= r.targetY) {
                explodeFirework(r.x, r.y, r.color);
                rockets.splice(i, 1);
            }
        }

        // Handle Particles (Explosion phase)
        ctx.globalCompositeOperation = 'lighter';
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.vx *= p.friction;
            p.vy *= p.friction;
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.012;

            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }

            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Random twinkle
            if (Math.random() < 0.1) {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(p.x, p.y, 2, 2);
            }
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
    };

    const drawHouses = () => {
        houses.forEach(h => {
            ctx.fillStyle = h.color;
            ctx.fillRect(h.x, h.y - h.height, h.width, h.height);
            ctx.beginPath();
            ctx.moveTo(h.x - 4, h.y - h.height);
            ctx.lineTo(h.x + h.width / 2, h.y - h.height - h.roofHeight);
            ctx.lineTo(h.x + h.width + 4, h.y - h.height);
            ctx.closePath();
            ctx.fillStyle = h.color;
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(h.x - 4, h.y - h.height);
            ctx.lineTo(h.x + h.width / 2, h.y - h.height - h.roofHeight);
            ctx.lineTo(h.x + h.width + 4, h.y - h.height);
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
            ctx.lineWidth = 4;
            ctx.stroke();
            if (h.hasChimney) {
                const chimneyW = 8;
                const chimneyH = 12;
                const cx = h.x + h.width * 0.7;
                const cy = h.y - h.height - h.roofHeight * 0.4;
                ctx.fillStyle = h.color;
                ctx.fillRect(cx, cy - chimneyH, chimneyW, chimneyH);
                if (Math.random() < 0.04) {
                    smokeParticles.push({ x: cx + chimneyW/2, y: cy - chimneyH, vy: -0.4 - Math.random() * 0.4, life: 1.0, size: 2 + Math.random() * 2 });
                }
            }
            ctx.fillStyle = h.windowColor;
            const flicker = 0.7 + Math.random() * 0.3; 
            ctx.globalAlpha = flicker;
            h.windows.forEach(w => { ctx.fillRect(h.x + w.x, h.y - h.height + w.y, w.w, w.h); });
            ctx.globalAlpha = 1;
        });
    };

    const drawSmoke = () => {
        for(let i=smokeParticles.length-1; i>=0; i--) {
            const s = smokeParticles[i];
            s.y += s.vy;
            s.x += Math.sin(Date.now() * 0.002 + s.y * 0.05) * 0.3; 
            s.life -= 0.005;
            s.size += 0.03;
            if(s.life <= 0) { smokeParticles.splice(i, 1); continue; }
            ctx.globalAlpha = s.life * 0.3;
            ctx.fillStyle = "#F0F0F0";
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI*2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawAurora();
      ctx.fillStyle = "white";
      stars.forEach(star => {
         star.opacity += star.twinkleSpeed;
         if (star.opacity > 1 || star.opacity < 0.2) star.twinkleSpeed = -star.twinkleSpeed;
         ctx.globalAlpha = Math.abs(star.opacity);
         ctx.beginPath();
         ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
         ctx.fill();
      });
      ctx.globalAlpha = 1;

      if (shootingStar) {
          const { x, y, length, opacity, angle } = shootingStar;
          const endX = x - Math.cos(angle) * length;
          const endY = y - Math.sin(angle) * length;
          const gradient = ctx.createLinearGradient(x, y, endX, endY);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
          gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
          ctx.lineWidth = 2;
          ctx.strokeStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          shootingStar.x += Math.cos(angle) * shootingStar.speed;
          shootingStar.y += Math.sin(angle) * shootingStar.speed;
          shootingStar.life--;
          shootingStar.opacity = Math.max(0, shootingStar.life / 60);
          if (shootingStar.life <= 0) shootingStar = null;
      } else {
          shootingStarTimer++;
          if (shootingStarTimer > 300 && Math.random() < 0.01) { spawnShootingStar(); shootingStarTimer = 0; }
      }

      // Fireworks
      drawFireworks(); 

      // Midground
      drawFog();
      forest.forEach(tree => {
         ctx.fillStyle = tree.color;
         ctx.beginPath();
         ctx.moveTo(tree.x, tree.y - tree.height);
         ctx.lineTo(tree.x - tree.width / 2, tree.y);
         ctx.lineTo(tree.x + tree.width / 2, tree.y);
         ctx.fill();
      });
      drawSmoke();
      drawHouses();
      drawSanta();

      // Snow
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.beginPath();
      for (let i = 0; i < mp; i++) {
        const p = flakes[i];
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, true);
      }
      ctx.fill();
      
      updateSnow();
      animationFrameId = requestAnimationFrame(draw);
    };

    let angle = 0;
    const updateSnow = () => {
      angle += 0.01;
      for (let i = 0; i < mp; i++) {
        const p = flakes[i];
        p.y += Math.cos(angle + p.density) + 1 + p.radius / 2;
        p.x += Math.sin(angle) * 2;
        if (p.x > canvas.width + 5 || p.x < -5 || p.y > canvas.height) {
          if (i % 3 > 0) {
            flakes[i] = { ...flakes[i], x: Math.random() * canvas.width, y: -10 };
          } else {
            if (Math.sin(angle) > 0) flakes[i] = { ...flakes[i], x: -5, y: Math.random() * canvas.height };
            else flakes[i] = { ...flakes[i], x: canvas.width + 5, y: Math.random() * canvas.height };
          }
        }
      }
    };

    window.addEventListener('resize', resize);
    resize();
    initElements();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-80"
    />
  );
};

export default SnowSystem;