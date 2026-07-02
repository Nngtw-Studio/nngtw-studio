/** @format */

'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HeroButton } from '@/components/sections/HeroButton';

function AmbientField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      accent: boolean;
    }[] = [];
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      /* Fewer, subtler particles — ambient not aggressive */
      const count = Math.floor((canvas.width * canvas.height) / 28000);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 1.2 + 0.3,
        opacity: Math.random() * 0.18 + 0.04,
        /* One in ~14 particles carries a whisper of brand-secondary — a hint of colour, never a wash of it */
        accent: Math.random() < 0.07,
      }));
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        /* Gentle parting around the cursor — the only place particles "react" */
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130 && dist > 0.01) {
          const force = ((130 - dist) / 130) * 0.5;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.accent
          ? `rgba(223, 19, 138, ${p.opacity * 0.8})`
          : `rgba(242, 239, 231, ${p.opacity})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-brand-black" />

      <AmbientField />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 text-center md:px-12 lg:px-20">
        {/* Main headline — title case, no orange on words */}
        <motion.h1
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ lineHeight: 0.98 }}
          className="editorial-heading mx-auto max-w-5xl text-[clamp(3.5rem,9vw,9rem)] text-brand-white"
        >
          <span className="relative z-10">
            Buildin
            <span data-cursor-spawn-anchor className="relative inline-block">
              g
            </span>
          </span>
          <br />
          <span className="relative isolate inline-block px-[0.1em]">
            <motion.span
              aria-hidden="true"
              initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              transition={{ duration: 0.5, delay: 1.3, ease: [0.65, 0, 0.35, 1] }}
              className="pointer-events-none absolute inset-0 bg-no-repeat"
              style={{
                backgroundImage: "url('/highlights/immersive-highlight.svg')",
                backgroundSize: 'cover',
                backgroundPosition: '50% 50%',
                transform: 'rotate(-2.5deg) scale(1.1, 0.97)',
                zIndex: -1,
              }}
            />
            immersive
          </span>
          <br />
          worlds
          <motion.span
            initial={{ color: '#f2efe7' }}
            animate={{ color: '#df138a' }}
            transition={{ duration: 0.35, delay: 1.85 }}
            className="text-[0.72em] align-baseline"
          >
            .
          </motion.span>
        </motion.h1>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="mt-20 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <HeroButton href="/games" variant="primary">
            Explore Worlds
          </HeroButton>
          <HeroButton href="/studio" variant="secondary">
            Enter Studio
          </HeroButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-14 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-3"
        >
          <div className="h-10 w-px bg-gradient-to-b from-brand-white/20 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
