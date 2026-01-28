"use client";

import { useEffect, useRef } from 'react';

export default function DataStreamBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particles for data stream effect
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: Math.random() * 2 + 1,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.5
      });
    }

    // Light streaks
    const streaks: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 5; i++) {
      streaks.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 100 + 50,
        speed: Math.random() * 3 + 2,
        opacity: Math.random() * 0.3 + 0.2
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(2, 12, 27, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(40, 98, 58, ${particle.opacity})`;
        ctx.fill();

        // Update particle position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Reset particle if it goes off screen
        if (particle.y > canvas.height) {
          particle.y = -10;
          particle.x = Math.random() * canvas.width;
        }
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.x = Math.random() * canvas.width;
        }
      });

      // Draw light streaks
      streaks.forEach(streak => {
        const gradient = ctx.createLinearGradient(
          streak.x, streak.y,
          streak.x, streak.y + streak.length
        );
        gradient.addColorStop(0, `rgba(40, 98, 58, 0)`);
        gradient.addColorStop(0.5, `rgba(40, 98, 58, ${streak.opacity})`);
        gradient.addColorStop(1, `rgba(40, 98, 58, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(streak.x, streak.y);
        ctx.lineTo(streak.x, streak.y + streak.length);
        ctx.stroke();

        // Update streak position
        streak.y += streak.speed;

        // Reset streak if it goes off screen
        if (streak.y > canvas.height) {
          streak.y = -streak.length;
          streak.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, #0F2027, #28623A)' }}
      />
      
      {/* Cybernetic code snippets */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 text-emerald-400/20 font-mono text-xs animate-pulse">
          {'0x7F4A2B9C'} {'0x8E3D1F6A'}
        </div>
        <div className="absolute top-40 right-32 text-emerald-400/15 font-mono text-xs animate-pulse" style={{ animationDelay: '1s' }}>
          {'0x2C8B5E1D'} {'0x4F9A3C7E'}
        </div>
        <div className="absolute bottom-32 left-40 text-emerald-400/10 font-mono text-xs animate-pulse" style={{ animationDelay: '2s' }}>
          {'0x6D1E9F4B'} {'0x3A7C2E8D'}
        </div>
        <div className="absolute bottom-20 right-20 text-emerald-400/20 font-mono text-xs animate-pulse" style={{ animationDelay: '0.5s' }}>
          {'0x9B4F2A7C'} {'0x1E8D3C6F'}
        </div>
      </div>
    </div>
  );
}
