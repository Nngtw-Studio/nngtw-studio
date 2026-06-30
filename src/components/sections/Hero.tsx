/** @format */

'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/motion/FadeIn';
import { BRAND } from '@/lib/constants';

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
    }[] = [];

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
      }));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        /* Warm cream/white — never orange */
        ctx.fillStyle = `rgba(242, 239, 231, ${p.opacity})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 30, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 25 });

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left - rect.width / 2) * 0.015);
        mouseY.set((e.clientY - rect.top - rect.height / 2) * 0.015);
      }}
    >
      <div className="absolute inset-0 bg-brand-black" />

      {/* Warm atmospheric glow — very subtle, no orange */}
      <motion.div
        style={{ x: springX, y: springY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/3 left-1/2 h-175 w-175 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-white/1.8 blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 h-100 w-100 rounded-full bg-brand-orange/2.5 blur-[120px]" />
      </motion.div>

      <AmbientField />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 text-center md:px-12 lg:px-20">
        {/* Overline label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="label-overline mb-10 text-brand-grey/70"
        >
          {BRAND.tagline}
        </motion.p>

        {/* Main headline — title case, no orange on words */}
        <motion.h1
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="editorial-heading mx-auto max-w-5xl text-[clamp(3.5rem,9vw,9rem)] text-brand-white"
        >
          Building
          <br />
          <em className="not-italic opacity-90">immersive</em>
          <br />
          worlds.
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="mx-auto mt-10 max-w-xl text-base leading-8 text-brand-grey md:text-lg"
        >
          {BRAND.description}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85 }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <MagneticButton>
            <Button href="/games" variant="primary" size="lg">
              Explore Games
            </Button>
          </MagneticButton>
          <MagneticButton>
            <Button href="/studio" variant="secondary" size="lg">
              About NNGTW
            </Button>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
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
