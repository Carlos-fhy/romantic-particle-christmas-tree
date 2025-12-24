import React, { useRef, useEffect } from 'react';

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

const MagicOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: DustParticle[] = [];
    let animationId: number;
    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMoving = true;
      
      // Spawn particles on move
      for (let i = 0; i < 3; i++) {
        particles.push(createParticle(mouseX, mouseY));
      }

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => { isMoving = false }, 100);
    };

    const createParticle = (x: number, y: number): DustParticle => {
      const hue = Math.random() * 60 + 20; // Gold/Orange/Yellow range
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        life: 1.0,
        size: Math.random() * 2 + 1,
        color: `hsla(${hue}, 100%, 70%, 1)`
      };
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        p.size *= 0.95;

        if (p.life > 0) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color.replace(', 1)', `, ${p.life})`);
          
          // Add glow
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Cleanup dead particles
      particles = particles.filter(p => p.life > 0);

      animationId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 mix-blend-screen"
    />
  );
};

export default MagicOverlay;