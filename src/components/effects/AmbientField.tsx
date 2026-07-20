/** @format */

'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Ambient particle field, shared by the intro overlay (fades in during its
 * idle window) and the Main Hero (fades in as the intro hands off) — two
 * independent canvases with the same look, crossfaded at the handoff so the
 * scene never appears to swap. See `IntroSplash.tsx` and `Hero.tsx`.
 */
export function AmbientField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId = 0;
    let width = 0;
    let height = 0;
    let inView = true;
    let pageVisible = !document.hidden;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseOpacity: number;
      /* 0.35 (far) → 1 (near). Drives size, speed, opacity and parallax
         so the field reads as a volume rather than a flat scatter. */
      depth: number;
      phase: number;
      tint: 'white' | 'pink' | 'orange';
    }

    let particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999 };
    /* Smoothed, depth-scaled drift of the whole field toward the cursor */
    const par = { x: 0, y: 0 };
    const parTarget = { x: 0, y: 0 };

    const initParticles = () => {
      /* Present but not aggressive — a visible starfield, not a snowstorm */
      const count = Math.floor((width * height) / 18750);
      particles = Array.from({ length: count }, () => {
        const depth = 0.35 + Math.random() * 0.65;
        /* Mostly off-white with a clear scatter of brand pink and orange */
        const roll = Math.random();
        const tint = roll < 0.1 ? 'pink' : roll < 0.2 ? 'orange' : 'white';
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.22 * depth,
          vy: (Math.random() - 0.5) * 0.22 * depth,
          /* Coloured tints get a touch more size — pink/orange are far darker
             than off-white on black and vanish at hairline widths */
          size: (Math.random() * 1.6 + 0.8) * depth + 0.4 + (tint === 'white' ? 0 : 0.4),
          baseOpacity: (Math.random() * 0.34 + 0.2) * depth,
          depth,
          phase: Math.random() * Math.PI * 2,
          tint,
        };
      });
    };

    const drawParticle = (p: Particle, opacity: number, ox = 0, oy = 0) => {
      ctx.beginPath();
      ctx.arc(p.x + ox, p.y + oy, p.size, 0, Math.PI * 2);
      /* Coloured tints run at full particle opacity — pink and orange are
         intrinsically darker than off-white, so this still reads as glints */
      ctx.fillStyle =
        p.tint === 'pink'
          ? `rgba(223, 19, 138, ${opacity})`
          : p.tint === 'orange'
            ? `rgba(245, 138, 31, ${opacity})`
            : `rgba(242, 239, 231, ${opacity})`;
      ctx.fill();
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => drawParticle(p, p.baseOpacity));
    };

    const resize = () => {
      /* Render at device resolution (capped at 2×) so particles stay crisp on retina */
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
      if (reduceMotion) drawStatic();
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      parTarget.x = e.clientX / width - 0.5;
      parTarget.y = e.clientY / height - 0.5;
    };

    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      parTarget.x = 0;
      parTarget.y = 0;
    };

    const animate = (t: number) => {
      const time = t * 0.001;
      par.x += (parTarget.x - par.x) * 0.04;
      par.y += (parTarget.y - par.y) * 0.04;

      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        /* Gentle parting around the cursor — the only place particles "react" */
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130 && dist > 0.01) {
          const force = ((130 - dist) / 130) * 0.5 * (0.3 + p.depth * 0.7);
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        /* Slow twinkle + depth-scaled parallax keep the field alive without noise */
        const twinkle = 0.75 + 0.25 * Math.sin(time * 0.8 + p.phase);
        drawParticle(p, p.baseOpacity * twinkle, par.x * p.depth * 18, par.y * p.depth * 18);
      });
      animationId = requestAnimationFrame(animate);
    };

    const startLoop = () => {
      if (animationId === 0 && inView && pageVisible) {
        animationId = requestAnimationFrame(animate);
      }
    };
    const stopLoop = () => {
      cancelAnimationFrame(animationId);
      animationId = 0;
    };

    resize();
    window.addEventListener('resize', resize);

    if (reduceMotion) {
      /* Static constellation — no loop, no listeners beyond resize */
      return () => window.removeEventListener('resize', resize);
    }

    /* Only burn frames while the field is actually watchable */
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && pageVisible) startLoop();
      else stopLoop();
    });
    observer.observe(canvas);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      if (inView && pageVisible) startLoop();
      else stopLoop();
    };

    startLoop();
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);
    return () => {
      stopLoop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
