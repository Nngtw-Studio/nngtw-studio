/** @format */

'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  MotionConfig,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { HeroButton } from '@/components/sections/HeroButton';
import { SOCIAL } from '@/lib/constants';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Film grain — inline SVG noise, tiled. Deliberately static: animated grain
   costs paint time and reads as compression artefacts, not cinema. */
const GRAIN_URL = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function AmbientField() {
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
      accent: boolean;
    }

    let particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999 };
    /* Smoothed, depth-scaled drift of the whole field toward the cursor */
    const par = { x: 0, y: 0 };
    const parTarget = { x: 0, y: 0 };

    const initParticles = () => {
      /* Fewer, subtler particles — ambient not aggressive */
      const count = Math.floor((width * height) / 26000);
      particles = Array.from({ length: count }, () => {
        const depth = 0.35 + Math.random() * 0.65;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.22 * depth,
          vy: (Math.random() - 0.5) * 0.22 * depth,
          size: (Math.random() * 1.1 + 0.4) * depth + 0.2,
          baseOpacity: (Math.random() * 0.16 + 0.05) * depth,
          depth,
          phase: Math.random() * Math.PI * 2,
          /* One in ~14 particles carries a whisper of brand-secondary — a hint of colour, never a wash of it */
          accent: Math.random() < 0.07,
        };
      });
    };

    const drawParticle = (p: Particle, opacity: number, ox = 0, oy = 0) => {
      ctx.beginPath();
      ctx.arc(p.x + ox, p.y + oy, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.accent
        ? `rgba(223, 19, 138, ${opacity * 0.8})`
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

    /* Only burn frames while the hero is actually watchable */
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

const rise = (delay: number, ready: boolean) => ({
  initial: { opacity: 0, y: 28 },
  animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
  transition: { duration: 1, delay, ease: EASE_OUT },
});

const lineRise = (i: number, ready: boolean) => ({
  initial: { opacity: 0, y: '0.55em' },
  animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: '0.55em' },
  transition: { duration: 1.15, delay: 0.25 + i * 0.12, ease: EASE_OUT },
});

/**
 * Holds the hero's entrance until the intro splash has fully handed off.
 * The splash claims `data-intro` on <html> synchronously with its first
 * paint and fires `intro-complete` when it retires (for any reason), so the
 * headline never animates behind the black backdrop. On routes or loads
 * where the splash never claims the screen, the entrance starts immediately.
 */
function useIntroGate() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const done = () => setReady(true);
    window.addEventListener('intro-complete', done);
    /* Check after the splash's own effects have run (they flush in the same
       commit, before this frame paints) — if it never claimed the screen,
       there is nothing to wait for. */
    const id = requestAnimationFrame(() => {
      if (document.documentElement.getAttribute('data-intro') !== '1') setReady(true);
    });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('intro-complete', done);
    };
  }, []);

  return ready;
}

export function Hero() {
  const reduce = useReducedMotion() ?? false;
  const ready = useIntroGate();
  const sectionRef = useRef<HTMLElement>(null);

  /* Mouse-driven light parallax — the glow layers lean gently toward the cursor */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 18 });
  const glowX = useTransform(springX, (v) => v * 24);
  const glowY = useTransform(springY, (v) => v * 16);

  /* Cinematic exit — content settles downward and dims as the next scene
     scrolls in. `reduce` only rescales runtime values so server and client
     always render identical markup. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);

  const scrollToNextSection = () => {
    window.dispatchEvent(new CustomEvent('featured-snap'));
    sectionRef.current?.nextElementSibling?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  const handleScrollCueClick = () => scrollToNextSection();

  /* Once the user has scrolled 40% through the hero, finish the transition
     for them so the section never gets stuck half-committed. Guarded to
     fire once per downward pass so it doesn't fight scrolling back up. */
  const autoScrolledRef = useRef(false);
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (progress >= 0.4 && !autoScrolledRef.current) {
      autoScrolledRef.current = true;
      scrollToNextSection();
    } else if (progress < 0.05) {
      autoScrolledRef.current = false;
    }
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce) return;
    mouseX.set(e.clientX / window.innerWidth - 0.5);
    mouseY.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    /* reducedMotion="user" strips transform animations for users who ask for
       calm, while keeping gentle opacity fades — and keeps SSR markup stable. */
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        data-hero
        onMouseMove={onMouseMove}
        className="relative flex min-h-svh items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-brand-black" />

        {/* Pixel-identical twin of the intro splash's primary wash — the two
            surfaces share one background, so the splash's end-of-ride
            crossfade reveals no change at all. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-20%] opacity-[0.05]"
          style={{
            background: `
              radial-gradient(ellipse 70% 62% at 44% 40%,
                rgba(245,138,31,0.9) 0%,
                rgba(245,138,31,0.45) 38%,
                rgba(245,138,31,0.15) 62%,
                transparent 82%
              )
            `,
          }}
        />

        {/* Lighting rig — only two lights remain: the primary wash above and
            this magenta whisper low right. Oversized so the parallax lean
            never reveals an edge. */}
        <motion.div
          style={{ x: glowX, y: glowY }}
          className="absolute -inset-10"
          aria-hidden="true"
        >
          {/* Magenta whisper — hidden while the splash owns the screen; the
              moment its auto-scroll hands off, it slowly breathes in. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
            style={{
              background:
                'radial-gradient(ellipse 50% 38% at 80% 90%, rgba(223,19,138,0.05), transparent 70%)',
            }}
            className="absolute inset-0"
          />
        </motion.div>

        <AmbientField />

        {/* Grain sits above the field so the surface feels filmic. The old
            edge vignette is gone — the splash has no vignette, and the two
            surfaces must share one identical background through the handoff. */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          aria-hidden="true"
          style={{ backgroundImage: GRAIN_URL, backgroundSize: '160px 160px' }}
        />

        {/* Content */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 mx-auto max-w-[1600px] px-6 text-center md:px-12 lg:px-20"
        >

          {/* Main headline — title case, no orange on words, revealed line by line */}

          <h1
            style={{ lineHeight: 0.98 }}
            className="editorial-heading mx-auto max-w-5xl text-[clamp(2.6rem,6.5vw,6rem)] text-brand-white"
          >
            <motion.span {...lineRise(0, ready)} className="block">
              buildin
              <span data-cursor-spawn-anchor className="relative z-10 inline-block">
                g
              </span>
            </motion.span>
            <motion.span {...lineRise(1, ready)} className="block">
              <span className="relative isolate inline-block px-[0.1em]">
                <motion.span
                  aria-hidden="true"
                  initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
                  animate={{ clipPath: ready ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)' }}
                  transition={{ duration: 0.5, delay: 1.2, ease: [0.65, 0, 0.35, 1] }}
                  className="pointer-events-none absolute inset-0 bg-no-repeat"
                  style={{
                    backgroundImage: "url('/highlights/immersive-highlight.svg')",
                    backgroundSize: 'cover',
                    backgroundPosition: '50% 50%',
                    transform: 'rotate(-1.5deg) scale(1.22, 0.97)',
                    zIndex: -1,
                  }}
                />
                immersive
              </span>
            </motion.span>
            <motion.span {...lineRise(2, ready)} className="block">
              worlds
              <motion.span
                initial={{ color: '#f2efe7' }}
                animate={{ color: ready ? '#df138a' : '#f2efe7' }}
                transition={{ duration: 0.35, delay: 1.65 }}
                className="text-[0.72em] align-baseline"
              >
                .
              </motion.span>
            </motion.span>
          </h1>

          {/* Supporting line — one unbroken editorial line on desktop, natural
              wrapping only where the viewport forces it */}
          <motion.p
            {...rise(0.7, ready)}
            className="mx-auto mt-5 font-body text-base md:text-xl lg:text-[24px] leading-relaxed text-brand-white/55 lg:whitespace-nowrap"
          >
            Crafting games and immersive experiences across mobile, PC, and XR.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...rise(0.9, ready)}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-0"
          >
            <HeroButton href="/games" variant="primary">
              Experience the Games
            </HeroButton>
            <HeroButton href="/studio" variant="secondary">
              Discover Why
            </HeroButton>
          </motion.div>
        </motion.div>

        {/* Vertical social icons stack in bottom-left corner */}
        <motion.div
          style={{ opacity: cueOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-11 left-6 z-20 hidden flex-col gap-4.5 md:left-12 lg:left-20 md:flex"
        >
          <a
            href={SOCIAL.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-white/40 hover:text-brand-white/60 transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2" fill="currentColor"/>
            </svg>
          </a>
          <a
            href={SOCIAL.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-white/40 hover:text-brand-white/60 transition-colors duration-300"
            aria-label="Facebook"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
            </svg>
          </a>
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-white/40 hover:text-brand-white/60 transition-colors duration-300"
            aria-label="Instagram"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a
            href={SOCIAL.x}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-white/40 hover:text-brand-white/60 transition-colors duration-300"
            aria-label="X (Twitter)"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </motion.div>

        {/* Scroll cue — vertical composition in the bottom-right corner */}
        <motion.div
          initial={{ opacity: 1 }}
          style={{ opacity: cueOpacity }}
          className="absolute bottom-11 right-6 z-10 hidden md:right-12 lg:right-20 [@media(min-height:620px)]:block"
        >
          <motion.button
            type="button"
            onClick={handleScrollCueClick}
            aria-label="Scroll to next section"
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ delay: 1.55, duration: 1 }}
            className="group flex items-center gap-2"
          >
            <div className="flex h-37.5 flex-col items-center justify-between font-accent text-[10px] font-light uppercase tracking-wider text-brand-white/40 transition-colors duration-300 group-hover:text-brand-white/60">
              <span>S</span>
              <span>C</span>
              <span>R</span>
              <span>O</span>
              <span>L</span>
              <span>L</span>
            </div>
            <div className="relative h-[150px] w-px overflow-hidden">
              <div className="absolute inset-0 bg-brand-white/40 transition-colors duration-300 group-hover:bg-brand-white/60" />
              {/* Reduced motion: the pulse's y animation is stripped, leaving it
                  parked above the clip window — the hairline simply stays still */}
              <motion.div
                initial={{ y: '-100%' }}
                animate={{ y: '400%' }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  repeatDelay: 0.4,
                  ease: [0.45, 0, 0.55, 1],
                }}
                className="absolute h-1/4 w-full bg-linear-to-b from-transparent via-brand-orange/70 to-transparent"
              />
            </div>
          </motion.button>
        </motion.div>
      </section>
    </MotionConfig>
  );
}
