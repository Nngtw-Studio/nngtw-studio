/** @format */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimationControls, useTransform } from 'framer-motion';
import { NAV_LINKS, SOCIAL, BRAND } from '@/lib/constants';
import { NAV_ICONS } from '@/components/layout/NavIcons';
import { RouteProgress } from '@/components/layout/RouteProgress';
import { HeaderLogo } from '@/components/layout/HeaderLogo';
import { easeSlice, useIntro } from '@/components/layout/IntroContext';
import { cn } from '@/lib/utils';

/**
 * Wraps a nav icon with a rare, tiny idle twitch — independent of hover —
 * so the nav feels quietly alive without ever looping or drawing attention.
 * Each icon reschedules itself on its own randomized 9–18s interval.
 */
function IdleIcon({ children }: { children: React.ReactNode }) {
  const controls = useAnimationControls();

  useEffect(() => {
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;

    const schedule = () => {
      const delay = 9000 + Math.random() * 9000;
      timeout = setTimeout(() => {
        if (cancelled) return;
        controls.start({
          rotate: [0, -5, 0],
          scale: [1, 1.05, 1],
          transition: { duration: 0.7, ease: 'easeInOut' },
        });
        schedule();
      }, delay);
    };

    schedule();
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [controls]);

  return (
    <motion.span animate={controls} className="inline-flex">
      {children}
    </motion.span>
  );
}

/**
 * One real header nav link. Always in its normal flex position — never
 * removed from flow, never duplicated — but while the intro is active it
 * carries a `transform: translate()` computed from the same `flightBetween`
 * math the intro always used, just reversed: the element's own natural rect
 * is the flight's end point, so it starts translated to where the intro's
 * (invisible, unrendered) row anchor measured, and eases to zero — arriving
 * at exactly where it already, structurally, is.
 */
/* Nav icons stay hidden until the logo's own reveal (icon wipe + all three
   wordmark pieces) has fully played, then reveal with the same circle-wipe
   used for page-change transitions (circle-out-center: clip-path circle
   0% → 125%, cubic-bezier(.25,1,.3,1)) instead of a plain fade. They cascade
   left to right with a hand-tuned cadence — calm start, gradually building,
   the last two overlapping for a cinematic finish — rather than a flat
   stagger: each still plays the same ~1s wipe. */
const NAV_REVEAL_DELAYS = [3.2, 3.575, 3.8875, 4.1375, 4.3125, 4.4375];
const NAV_REVEAL_DURATION = 0.5;

function NavLink({ link, index, fastReveal = false }: { link: { href: string; label: string }; index: number; fastReveal?: boolean }) {
  const { active, progress, flights, reduce } = useIntro();
  const Icon = NAV_ICONS[link.href];
  const flight = flights?.nav[link.href];
  const pathname = usePathname();

  const isActive =
    pathname === link.href || pathname.startsWith(`${link.href}/`);
  /* Circle overlay lifecycle: 'in' reveals the highlighted icon with
     circle-in-center and holds it; 'out' plays circle-out-center and
     unmounts when it finishes. Driven purely by route changes — hover
     never replays it. */
  const [phase, setPhase] = useState<'off' | 'in' | 'out'>(
    isActive ? 'in' : 'off',
  );
  const prevActive = useRef(isActive);

  useEffect(() => {
    if (prevActive.current === isActive) return;
    prevActive.current = isActive;
    setPhase(isActive ? 'in' : 'out');
  }, [isActive]);

  const x = useTransform(progress, [0.02, 0.82], [flight ? -flight.x : 0, 0], easeSlice);
  const y = useTransform(progress, [0.02, 0.82], [flight ? -flight.y : 0, 0], easeSlice);

  return (
    /* Fixed-footprint slot — never resizes, so hovering one icon never
       shifts its neighbors. The actual pill is centered inside it via
       absolute positioning + translate(-50%,-50%), so when the label grows
       on hover it lengthens equally left and right instead of only pushing
       rightward into the next icon.

       This OUTER span is the intro flight's measurement anchor
       (`data-intro-nav`) and is deliberately NEVER transformed: the flight
       translate lives on the inner `motion.span` instead. That keeps the
       anchor's rect equal to the icon's true header rest position at all
       times, so IntroContext can safely re-measure it on any resize —
       including the resize a mobile browser fires mid-scroll when the URL
       bar hides. Were the transform on this box, a re-measure would read
       its own mid-flight position back as "rest" and collapse the flight. */
    <motion.span
      data-intro-nav={link.href}
      className="relative flex h-8 w-8 items-center justify-center"
    >
     <motion.span style={{ x, y }} className="absolute inset-0 flex items-center justify-center">
      <Link
        href={link.href}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'group absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center rounded-full px-1.5 py-1.5 whitespace-nowrap text-brand-grey transition-colors duration-300 hover:text-brand-white hover:bg-brand-white/5',
        )}
      >
        <IdleIcon>
          <motion.span
            className="relative inline-flex"
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(125% at 50% 50%)' }}
            exit={{ 
              clipPath: 'circle(0% at 50% 50%)',
              transition: {
                delay: reduce ? 0 : [0, 0.375, 0.6875, 0.9375, 1.1125, 1.2375][index] || 0,
                duration: reduce ? 0.2 : 0.4,
                ease: [0.25, 1, 0.3, 1]
              }
            }}
            transition={{
              delay: reduce ? 0 : (fastReveal ? [0.25, 0.2, 0.15, 0.1, 0.05, 0][index] : (active ? NAV_REVEAL_DELAYS[index] : [1.2375, 1.1125, 0.9375, 0.6875, 0.375, 0][index])) || 0,
              duration: reduce ? 0.2 : (fastReveal ? 0.4 : (active ? NAV_REVEAL_DURATION : 0.4)),
              ease: [0.25, 1, 0.3, 1],
            }}
          >
            <Icon className="h-5 w-5 shrink-0 opacity-60 transition-[transform,opacity] duration-500 ease-out group-hover:-rotate-6 group-hover:scale-110 group-hover:opacity-100" />
            {phase !== 'off' && (
              <span
                aria-hidden="true"
                onAnimationEnd={() => {
                  if (phase === 'out') setPhase('off');
                }}
                className={cn(
                  'absolute inset-0 inline-flex text-brand-white',
                  phase === 'in'
                    ? 'animate-nav-circle-in'
                    : 'animate-nav-circle-out',
                )}
              >
                <Icon className="h-5 w-5 shrink-0 transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-110" />
              </span>
            )}
          </motion.span>
        </IdleIcon>
        <span className="max-w-0 overflow-hidden font-accent text-[10px] tracking-[0.25em] whitespace-nowrap uppercase opacity-0 transition-all duration-500 ease-out group-hover:ml-2 group-hover:max-w-25 group-hover:opacity-100">
          {link.label}
        </span>
      </Link>
     </motion.span>
    </motion.span>
  );
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return { matches, mounted };
}

export function Header() {
  const { active: introActive } = useIntro();
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { matches: isMd, mounted } = useMediaQuery('(min-width: 768px)');
  const isDesktop = !mounted || isMd;

  const [layoutPhase, setLayoutPhase] = useState<'desktop' | 'mobile' | 'to-desktop' | 'to-mobile'>(isDesktop ? 'desktop' : 'mobile');
  const layoutPhaseRef = useRef(layoutPhase);
  layoutPhaseRef.current = layoutPhase;

  const prevIsDesktop = useRef(isDesktop);
  
  const isInitialRender = useRef(true);
  useEffect(() => {
    isInitialRender.current = false;
  }, []);

  useEffect(() => {
    if (isDesktop !== prevIsDesktop.current) {
      if (isDesktop) {
        if (layoutPhaseRef.current === 'mobile' && !introActive) setLayoutPhase('to-desktop');
        else setLayoutPhase('desktop');
      } else {
        if (layoutPhaseRef.current === 'desktop') setLayoutPhase('to-mobile');
        else setLayoutPhase('mobile');
      }
      prevIsDesktop.current = isDesktop;
    }
  }, [isDesktop, introActive]);

  const padDesktop = layoutPhase === 'desktop' || layoutPhase === 'to-mobile';

  useEffect(() => {
    setNavVisible(true);
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let snapSettleTimer: ReturnType<typeof setTimeout> | undefined;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    const heroVisibleRef = { current: true };
    /* True while the snap's smooth scroll is in flight — its own scroll
       events must not re-show the nav the snap just hid. */
    let snapping = false;

    const scheduleHide = () => {
      if (heroVisibleRef.current) return;
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setNavVisible(false), 5000);
    };

    /* CSS proximity snap gives no event — when scrolling settles with a
       `.snap-start` section pinned to the viewport top, treat it as a snap
       landing and hide the nav, matching the hero → featured behavior. */
    const onSettled = () => {
      /* Snap-hide never applies while a page's hero is on screen — the nav
         stays up until the visitor has actually left the hero. */
      if (heroVisibleRef.current) return;
      for (const el of document.querySelectorAll('.snap-start')) {
        if (Math.abs(el.getBoundingClientRect().top) < 4) {
          if (hideTimer) clearTimeout(hideTimer);
          setNavVisible(false);
          return;
        }
      }
    };

    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(onSettled, 150);
      if (snapping) {
        /* Still auto-scrolling; release the guard once it settles */
        if (snapSettleTimer) clearTimeout(snapSettleTimer);
        snapSettleTimer = setTimeout(() => {
          snapping = false;
        }, 200);
        return;
      }
      setNavVisible(true);
      if (heroVisibleRef.current) return;
      scheduleHide();
    };

    const onFeaturedSnap = () => {
      if (hideTimer) clearTimeout(hideTimer);
      heroVisibleRef.current = false;
      snapping = true;
      setNavVisible(false);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('featured-snap', onFeaturedSnap);

    let heroObserver: IntersectionObserver | null = null;
    let domObserver: MutationObserver | null = null;

    const setupHeroObserver = () => {
      const hero = document.querySelector<HTMLElement>('[data-hero]');
      if (!hero) return false;

      heroObserver = new IntersectionObserver(
        ([entry]) => {
          heroVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            if (hideTimer) clearTimeout(hideTimer);
            setNavVisible(true);
          } else {
            scheduleHide();
          }
        },
        { threshold: 0.2 },
      );
      heroObserver.observe(hero);
      return true;
    };

    if (!setupHeroObserver()) {
      heroVisibleRef.current = false;
      scheduleHide();

      domObserver = new MutationObserver(() => {
        if (setupHeroObserver()) {
          domObserver?.disconnect();
          domObserver = null;
        }
      });
      domObserver.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('featured-snap', onFeaturedSnap);
      heroObserver?.disconnect();
      domObserver?.disconnect();
      if (hideTimer) clearTimeout(hideTimer);
      if (snapSettleTimer) clearTimeout(snapSettleTimer);
      if (settleTimer) clearTimeout(settleTimer);
    };
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          /* The intro drives the header's own logo/nav elements directly —
             its own scroll-hide must never fight that with a transform of
             its own (a `<header>` transform would redefine the containing
             block for the logo's `position: fixed` flight wrapper). */
          !navVisible && !mobileOpen && !introActive && '-translate-y-full opacity-0',
          scrolled
            ? 'bg-brand-black/85 backdrop-blur-xl'
            : 'bg-transparent',
        )}
      >
        <div
          data-intro-anchor="logo-row"
          className={cn("relative mx-auto flex h-20 max-w-[1600px] items-center justify-between", padDesktop ? "px-12 lg:px-20" : "px-6")}
        >
          {/* Left nav icons */}
          <nav className="flex items-center gap-19.5">
            <AnimatePresence>
              {layoutPhase === 'desktop' &&
                NAV_LINKS.slice(0, 3).map((link, i) => (
                  <NavLink key={link.href} link={link} index={i} fastReveal={!isInitialRender.current} />
                ))}
            </AnimatePresence>
          </nav>

          {/* Logo — centered; hover paints the orange fist in with the intro wipe */}
          <HeaderLogo />

          {/* Right nav icons */}
          <nav className="flex items-center gap-19.5">
            <AnimatePresence onExitComplete={() => {
              if (layoutPhaseRef.current === 'to-mobile') setLayoutPhase('mobile');
            }}>
              {layoutPhase === 'desktop' &&
                NAV_LINKS.slice(3, 6).map((link, i) => (
                  <NavLink key={link.href} link={link} index={3 + i} fastReveal={!isInitialRender.current} />
                ))}
            </AnimatePresence>
          </nav>

          {/* Mobile menu button — hidden while the intro owns the screen, so
              there's nothing to appear clickable behind it. */}
          <AnimatePresence onExitComplete={() => {
            if (layoutPhaseRef.current === 'to-desktop') setLayoutPhase('desktop');
          }}>
            {!introActive && layoutPhase === 'mobile' && (
              <motion.button
                key="mobile-toggle"
                initial={{ clipPath: 'inset(0 100% 0 100%)' }}
                animate={{ clipPath: ['inset(0 100% 0 100%)', 'inset(0 10% 0 10%)', 'inset(0 10% 0 10%)', 'inset(0 0 0 0)'] }}
                exit={{ clipPath: ['inset(0 0 0 0)', 'inset(0 10% 0 10%)', 'inset(0 10% 0 10%)', 'inset(0 100% 0 100%)'] }}
                transition={{ duration: 0.8, ease: "easeInOut", times: [0, 0.3, 0.7, 1], delay: 0.1 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="absolute right-6 top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 flex-col items-center justify-center gap-1.5"
                aria-label="Toggle menu"
              >
                <motion.span
                  animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="block h-px w-5 bg-brand-white"
                />
                <motion.span
                  animate={
                    mobileOpen
                      ? { opacity: 0, scaleX: 0 }
                      : { opacity: 1, scaleX: 1 }
                  }
                  transition={{ duration: 0.2 }}
                  className="block h-px w-5 bg-brand-white"
                />
                <motion.span
                  animate={
                    mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
                  }
                  transition={{ duration: 0.3 }}
                  className="block h-px w-5 bg-brand-white"
                />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Loading bar riding the header's hairline border */}
        <RouteProgress />
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 flex flex-col bg-brand-black md:hidden"
          >
            {/* Subtle ambient glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-white/[0.01] to-transparent" />

            <div className="relative flex flex-1 flex-col items-start justify-center px-8">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{
                    delay: i * 0.06,
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="py-3"
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="group font-display text-4xl text-brand-white/80 transition-colors duration-300 hover:text-brand-white"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  delay: NAV_LINKS.length * 0.06 + 0.05,
                  duration: 0.5,
                }}
                className="mt-10"
              >
                <a
                  href={SOCIAL.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="cursor-target flex items-center gap-3 font-accent text-[10px] tracking-[0.3em] uppercase text-[#5865F2]"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                  </svg>
                  Join Discord
                </a>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="relative pb-12 pl-8 label-overline text-brand-grey/40"
            >
              {BRAND.tagline}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
