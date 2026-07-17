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

  /* The nav glow blooms ahead of the rest of the entrance — the splash cues
     it as its backdrop starts dissolving, so the orange band rises underneath
     while the splash's travelling copy of the same light fades out above.
     `ready` is the fallback for loads where the splash never runs. */
  const [glowHandoff, setGlowHandoff] = useState(false);
  useEffect(() => {
    const on = () => setGlowHandoff(true);
    window.addEventListener('intro-glow-handoff', on);
    return () => window.removeEventListener('intro-glow-handoff', on);
  }, []);
  const navGlowOn = glowHandoff || ready;

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
  /* Keep the side controls on one opacity driver. Previously their scroll
     opacity was combined with a separate Framer `animate` opacity, so the
     entrance animation could write the value back after scrolling had hidden
     them. They now fade continuously with the hero and are fully gone when
     the hero has ended. */
  const cueOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

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

        {/* Lighting rig — two corner whispers, orange low right and pink low
            left. Oversized so the parallax lean never reveals an edge. */}
        <motion.div
          style={{ x: glowX, y: glowY }}
          className="absolute -inset-10"
          aria-hidden="true"
        >
          {/* Orange whisper — hidden while the splash owns the screen; the
              moment its auto-scroll hands off, it slowly breathes in, then
              idles like the pink one. Runs dimmer (3.5%) and on a longer,
              offset cycle so the two lights never pulse in sync. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <motion.div
              animate={
                reduce
                  ? undefined
                  : { opacity: [1, 0.75, 1], x: [0, -12, 0], y: [0, -8, 0] }
              }
              transition={{ duration: 17, delay: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background:
                  'radial-gradient(ellipse 50% 38% at 80% 90%, rgba(245,138,31,0.035), transparent 70%)',
              }}
              className="absolute inset-0"
            />
          </motion.div>
          {/* Pink whisper — the low-left counterweight behind the social rail.
              Same breathe-in, then a barely-there idle: a slow pulse and drift
              so the light feels alive without ever drawing the eye. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <motion.div
              animate={
                reduce
                  ? undefined
                  : { opacity: [1, 0.7, 1], x: [0, 14, 0], y: [0, -10, 0] }
              }
              transition={{ duration: 14, delay: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background:
                  'radial-gradient(ellipse 45% 40% at 10% 72%, rgba(223,19,138,0.05), transparent 70%)',
              }}
              className="absolute inset-0"
            />
          </motion.div>
        </motion.div>

        {/* Nav glow — the orange band the splash's travelling light hands off
            to, identical gradient to its final frame. Deliberately outside the
            parallax rig: it illuminates the fixed header, so it must not lean
            with the cursor. Its quick bloom runs under the splash's dissolving
            backdrop, crossfading with the splash's copy — a seamless relay. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: navGlowOn ? 1 : 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{
            background:
              'radial-gradient(ellipse 70% 26% at 50% 4%, rgba(245,138,31,0.05), rgba(245,138,31,0.02) 45%, transparent 82%)',
          }}
          className="absolute inset-0"
          aria-hidden="true"
        />

        <AmbientField />

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
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-0 sm:-space-x-2"
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
          className="absolute bottom-14 left-8 z-20 hidden flex-col gap-7 md:bottom-16 md:left-12 lg:left-20 md:flex"
        >
          <a
            href={SOCIAL.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="-m-2.5 inline-flex items-center justify-center p-2.5 text-brand-white/40 transition-colors duration-300 hover:text-brand-white/60"
            aria-label="LinkedIn"
          >
            <svg className="h-3 w-3" viewBox="0 0 25 24" fill="currentColor">
              <path d="m5.706 7.798v16.202h-5.395v-16.202zm.343-5.002c.001.029.002.063.002.098 0 .749-.318 1.423-.826 1.895l-.002.001c-.545.498-1.274.803-2.075.803-.049 0-.099-.001-.148-.003h.007-.033c-.041.002-.089.003-.137.003-.784 0-1.496-.306-2.025-.804l.001.001c-.504-.488-.816-1.17-.816-1.925 0-.024 0-.048.001-.073v.004c-.001-.021-.001-.045-.001-.069 0-.762.324-1.448.841-1.929l.002-.001c.544-.495 1.271-.799 2.068-.799.046 0 .091.001.137.003h-.006c.043-.002.092-.003.143-.003.785 0 1.5.303 2.034.798l-.002-.002c.515.497.835 1.193.835 1.964v.042-.002zm19.062 11.92v9.284h-5.378v-8.665c.005-.079.007-.171.007-.263 0-.896-.249-1.733-.682-2.447l.012.021c-.427-.596-1.117-.979-1.896-.979-.06 0-.12.002-.18.007h.008c-.027-.001-.058-.002-.089-.002-.62 0-1.19.213-1.641.57l.006-.004c-.453.367-.808.836-1.032 1.375l-.008.023c-.116.355-.182.763-.182 1.187 0 .048.001.096.003.144v-.007 9.042h-5.378q.033-6.523.033-10.578t-.016-4.839l-.016-.785h5.378v2.354h-.033c.214-.345.435-.644.678-.924l-.008.009c.281-.309.583-.588.908-.838l.016-.012c.404-.311.878-.555 1.392-.704l.03-.007c.538-.161 1.157-.254 1.797-.254h.079-.004c.071-.003.154-.005.237-.005 1.681 0 3.195.714 4.256 1.856l.003.004q1.702 1.856 1.702 5.436z"/>
            </svg>
          </a>
          <a
            href={SOCIAL.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="-m-2.5 inline-flex items-center justify-center p-2.5 text-brand-white/40 transition-colors duration-300 hover:text-brand-white/60"
            aria-label="Facebook"
          >
            <svg className="h-3 w-3" viewBox="0 0 25.26 47.17" fill="currentColor">
              <path d="M23.61 26.53 24.92 18h-8.19v-5.54c0-2.34 1.14-4.62 4.81-4.62h3.72V.58A45.17 45.17 0 0 0 18.65 0C11.91 0 7.5 4.09 7.5 11.49V18H0v8.54h7.5v20.63h9.23V26.53Z"/>
            </svg>
          </a>
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="-m-2.5 inline-flex items-center justify-center p-2.5 text-brand-white/40 transition-colors duration-300 hover:text-brand-white/60"
            aria-label="Instagram"
          >
            <svg className="h-3 w-3" viewBox="0 0 256 256" fill="currentColor">
              <circle cx="128" cy="128" r="32"/>
              <path d="M172,28H84A56.06353,56.06353,0,0,0,28,84v88a56.06353,56.06353,0,0,0,56,56h88a56.06353,56.06353,0,0,0,56-56V84A56.06353,56.06353,0,0,0,172,28ZM128,176a48,48,0,1,1,48-48A48.05436,48.05436,0,0,1,128,176Zm52-88a12,12,0,1,1,12-12A12,12,0,0,1,180,88Z"/>
            </svg>
          </a>
          <a
            href={SOCIAL.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="-m-2.5 inline-flex items-center justify-center p-2.5 text-brand-white/40 transition-colors duration-300 hover:text-brand-white/60"
            aria-label="Discord"
          >
            <svg className="h-3 w-3" viewBox="0 0 33.867 33.867" fill="currentColor">
              <path d="M11.343 5.177c-1.076 0-4.32 1.316-4.902 1.579-.582.263-1.228 1.084-1.961 2.439-.734 1.355-1.323 2.939-2.28 5.269-.956 2.33-1.179 6.822-1.147 8.193.032 1.371.189 2.442 1.594 3.253 1.404.81 2.646 1.658 3.953 2.168 1.308.51 2.2.877 2.806.367.606-.51 1.005-1.403 1.005-1.403s.574-.797-.51-1.275c-1.084-.479-1.626-.814-1.579-1.308.048-.494.127-.765.398-.701.271.064.91 1.211 3.365 1.737s4.848.447 4.848.447 2.394.08 4.849-.447c2.455-.526 3.093-1.673 3.364-1.737.271-.064.35.207.398.7.048.495-.494.83-1.578 1.309-1.084.478-.51 1.275-.51 1.275s.399.892 1.005 1.403c.605.51 1.498.143 2.805-.367 1.307-.51 2.55-1.357 3.954-2.168 1.405-.811 1.562-1.882 1.594-3.253.032-1.37-.191-5.863-1.148-8.193-.956-2.33-1.546-3.914-2.28-5.269-.732-1.355-1.379-2.176-1.96-2.44-.582-.262-3.827-1.578-4.903-1.578-1.076 0-1.394.75-1.394.75l-.375.829s-2.52-.479-3.804-.48c-1.284 0-3.837.48-3.837.48l-.375-.83s-.318-.749-1.395-.749zm.117 9.948h.04c1.569 0 2.84 1.373 2.84 3.066 0 1.694-1.271 3.066-2.84 3.066s-2.84-1.372-2.84-3.066c-.001-1.677 1.247-3.043 2.8-3.066zm10.907 0h.04c1.553.023 2.8 1.39 2.8 3.066 0 1.694-1.271 3.066-2.84 3.066-1.57 0-2.84-1.372-2.84-3.066 0-1.693 1.27-3.066 2.84-3.066z"/>
            </svg>
          </a>
        </motion.div>

        {/* Scroll cue — vertical composition in the bottom-right corner */}
        <motion.div
          style={{ opacity: cueOpacity }}
          className="absolute bottom-11 right-6 z-10 hidden md:right-12 lg:right-20 [@media(min-height:620px)]:block"
        >
          <motion.button
            type="button"
            onClick={handleScrollCueClick}
            aria-label="Scroll to next section"
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
            <div className="relative h-37.5 w-px overflow-hidden">
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
