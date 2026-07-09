/** @format */

'use client';

import { useEffect, useRef } from 'react';
import {
  motion,
  MotionConfig,
  useMotionValue,
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

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay, ease: EASE_OUT },
});

const lineRise = (i: number) => ({
  initial: { opacity: 0, y: '0.55em' },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.15, delay: 0.25 + i * 0.12, ease: EASE_OUT },
});

export function Hero() {
  const reduce = useReducedMotion() ?? false;
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
        onMouseMove={onMouseMove}
        className="relative flex min-h-svh items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-brand-black" />

        {/* Atmospheric depth — three layered radial gradients painted directly
            with no background colour and no filter:blur(). The transparent stops
            do all the feathering so there is no perceivable element boundary.
              L1: cream mist — tightest, strongest, directly behind headline
              L2: amber warmth — wider, very low opacity, warm undertone
              L3: huge ambient — enormous, barely visible, holds the whole field */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'visible',
            background: `
              radial-gradient(ellipse 900px 550px at 50% 30%,
                rgba(247,242,234,0.08) 0%,
                transparent 72%
              ),
              radial-gradient(ellipse 1300px 900px at 50% 42%,
                rgba(245,138,31,0.02) 0%,
                transparent 70%
              ),
              radial-gradient(ellipse 1800px 1200px at 50% 50%,
                rgba(255,255,255,0.01) 0%,
                transparent 80%
              )
            `,
          }}
        />

        {/* Lighting rig — a warm key light above the headline, a magenta whisper
            low right, and a floor glow beneath the CTAs. Oversized so the
            parallax lean never reveals an edge. */}
        <motion.div
          style={{ x: glowX, y: glowY }}
          className="absolute -inset-10"
          aria-hidden="true"
        >
          <motion.div
            animate={{ opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 85% 60% at 50% -12%, rgba(245,138,31,0.11), transparent 65%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 50% 38% at 80% 90%, rgba(223,19,138,0.05), transparent 70%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 55% 28% at 50% 106%, rgba(245,138,31,0.07), transparent 70%)',
            }}
          />
        </motion.div>

        <AmbientField />

        {/* Vignette and grain sit above the field so the edges stay quiet and the surface feels filmic */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 120% 95% at 50% 42%, transparent 58%, rgba(29,16,16,0.85) 100%)',
          }}
        />
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
            <motion.span {...lineRise(0)} className="block">
              buildin
              <span data-cursor-spawn-anchor className="relative z-10 inline-block">
                g
              </span>
            </motion.span>
            <motion.span {...lineRise(1)} className="block">
              <span className="relative isolate inline-block px-[0.1em]">
                <motion.span
                  aria-hidden="true"
                  initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
                  animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                  transition={{ duration: 0.5, delay: 1.2, ease: [0.65, 0, 0.35, 1] }}
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
            </motion.span>
            <motion.span {...lineRise(2)} className="block">
              worlds
              <motion.span
                initial={{ color: '#f2efe7' }}
                animate={{ color: '#df138a' }}
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
            {...rise(0.7)}
            className="mx-auto mt-5 font-body text-base md:text-xl lg:text-[24px] leading-relaxed text-brand-white/55 lg:whitespace-nowrap"
          >
            Crafting games and immersive experiences across mobile, PC, and XR.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...rise(0.9)}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
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
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-11 left-6 z-20 hidden flex-col gap-4.5 md:left-12 lg:left-20 md:flex"
        >
          <a
            href={SOCIAL.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-grey/45 hover:text-brand-orange transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2" fill="currentColor"/>
            </svg>
          </a>
          <a
            href={SOCIAL.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-grey/45 hover:text-brand-orange transition-colors duration-300"
            aria-label="Facebook"
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
            </svg>
          </a>
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-grey/45 hover:text-brand-orange transition-colors duration-300"
            aria-label="Instagram"
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a
            href={SOCIAL.x}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-grey/45 hover:text-brand-orange transition-colors duration-300"
            aria-label="X (Twitter)"
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.55, duration: 1 }}
            className="flex items-center gap-2"
          >
            <div className="flex flex-col items-center gap-1 font-accent text-[7px] font-light uppercase tracking-wider text-brand-white/25">
              <span>S</span>
              <span>C</span>
              <span>R</span>
              <span>O</span>
              <span>L</span>
              <span>L</span>
            </div>
            <div className="relative h-[150px] w-px overflow-hidden">
              <div className="absolute inset-0 bg-brand-white/10" />
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
          </motion.div>
        </motion.div>
      </section>
    </MotionConfig>
  );
}
