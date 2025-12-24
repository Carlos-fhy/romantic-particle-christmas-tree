import React, { useEffect, useRef } from 'react';

interface ShootingStarProps {
  isVisible: boolean;
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  alpha: number;
  color: { r: number; g: number; b: number };
}

const ShootingStar: React.FC<ShootingStarProps> = ({ isVisible, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isVisible) {
      particlesRef.current = [];
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 流星起始位置
    const startX = window.innerWidth * (Math.random() * 0.25 + 0.65);
    const startY = window.innerHeight * (Math.random() * 0.12 + 0.08);
    const angle = (Math.random() * 12 + 42) * (Math.PI / 180);

    startTimeRef.current = Date.now();
    particlesRef.current = [];

    // 快速流星核心
    const speed = 18; // 快速划过
    const vx = -Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    particlesRef.current.push({
      x: startX,
      y: startY,
      vx,
      vy,
      life: 1.0,
      maxLife: 1.0,
      size: 3,
      alpha: 0,
      color: { r: 255, g: 255, b: 255 },
    });

    let lastTime = Date.now();
    let trailTimer = 0;

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      const elapsed = (currentTime - startTimeRef.current) / 1000;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      const particles = particlesRef.current;

      // 全局渐入渐出（快速）
      let globalAlpha = 1;
      if (elapsed < 0.15) {
        globalAlpha = elapsed / 0.15; // 0.15 秒快速渐入
      } else if (elapsed > 0.8) {
        globalAlpha = Math.max(0, 1 - (elapsed - 0.8) / 0.2); // 最后 0.2 秒渐出
      }

      // 生成少量拖尾粒子
      if (elapsed < 0.7) {
        trailTimer += deltaTime;
        if (trailTimer > 0.015) { // 适度生成
          trailTimer = 0;
          const core = particles[0];
          if (core) {
            // 每次 2-3 个粒子
            for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
              const spread = (Math.random() - 0.5) * 0.2;
              particles.push({
                x: core.x + (Math.random() - 0.5) * 3,
                y: core.y + (Math.random() - 0.5) * 3,
                vx: core.vx * (0.4 + Math.random() * 0.3),
                vy: core.vy * (0.4 + Math.random() * 0.3) + spread,
                life: 0.5 + Math.random() * 0.3,
                maxLife: 0.5 + Math.random() * 0.3,
                size: 1.5 + Math.random() * 1.5,
                alpha: 1,
                color: {
                  r: 255,
                  g: Math.floor(220 + Math.random() * 35),
                  b: Math.floor(100 + Math.random() * 50),
                },
              });
            }
          }
        }
      }

      // 更新和绘制
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx * deltaTime * 60;
        p.y += p.vy * deltaTime * 60;
        p.life -= deltaTime;
        p.alpha = Math.max(0, p.life / p.maxLife);

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const finalAlpha = p.alpha * globalAlpha;

        // 简化的两层发光
        // 外层柔和光晕
        ctx.save();
        ctx.globalAlpha = finalAlpha * 0.3;
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
        glow.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.6)`);
        glow.addColorStop(0.5, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.3)`);
        glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 明亮核心
        ctx.save();
        ctx.globalAlpha = finalAlpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${finalAlpha})`;
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${finalAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.globalCompositeOperation = 'source-over';

      // 1 秒后结束
      if (particles.length > 0 && elapsed < 1.0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ background: 'transparent' }}
    />
  );
};

export default ShootingStar;
