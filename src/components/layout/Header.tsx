/** @format */

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { NAV_LINKS, SOCIAL, BRAND } from '@/lib/constants';
import { BRAND_ASSETS } from '@/lib/brand';
import { NAV_ICONS } from '@/components/layout/NavIcons';
import { RouteProgress } from '@/components/layout/RouteProgress';
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

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
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
      setScrolled(window.scrollY > 50);
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

    const hero = document.querySelector<HTMLElement>('[data-hero]');
    const heroObserver = hero
      ? new IntersectionObserver(
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
        )
      : null;
    heroObserver?.observe(hero!);
    if (!hero) {
      heroVisibleRef.current = false;
      scheduleHide();
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('featured-snap', onFeaturedSnap);
      heroObserver?.disconnect();
      if (hideTimer) clearTimeout(hideTimer);
      if (snapSettleTimer) clearTimeout(snapSettleTimer);
      if (settleTimer) clearTimeout(settleTimer);
    };
  }, []);

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
          !navVisible && !mobileOpen && '-translate-y-full opacity-0',
          scrolled
            ? 'bg-brand-black/85 backdrop-blur-xl border-b border-brand-white/[0.04]'
            : 'bg-transparent',
        )}
      >
        <div className="relative mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 md:px-12 lg:px-20">
          {/* Left nav icons */}
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.slice(0, 3).map((link) => {
              const Icon = NAV_ICONS[link.href];
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-intro-nav={link.href}
                  className="group flex items-center rounded-full px-3.5 py-2.5 text-brand-grey transition-colors duration-300 hover:text-brand-white hover:bg-brand-white/5"
                >
                  <IdleIcon>
                    <Icon className="h-5 w-5 shrink-0 opacity-60 transition-[transform,opacity] duration-500 ease-out group-hover:-rotate-6 group-hover:scale-110 group-hover:opacity-100" />
                  </IdleIcon>
                  <span className="max-w-0 overflow-hidden font-accent text-[10px] tracking-[0.25em] whitespace-nowrap uppercase opacity-0 transition-all duration-500 ease-out group-hover:ml-2 group-hover:max-w-25 group-hover:opacity-100">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Logo — centered */}
          <Link
            href="/"
            className="group absolute top-1/2 left-1/2 shrink-0 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 hover:opacity-70"
          >
            <img
              data-intro-target="brand-icon"
              src={BRAND_ASSETS.compactLogo}
              alt="Nngtw Studio"
              className="h-8 w-auto"
            />
          </Link>

          {/* Right nav icons */}
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.slice(3, 6).map((link) => {
              const Icon = NAV_ICONS[link.href];
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-intro-nav={link.href}
                  className="group flex items-center rounded-full px-3.5 py-2.5 text-brand-grey transition-colors duration-300 hover:text-brand-white hover:bg-brand-white/5"
                >
                  <IdleIcon>
                    <Icon className="h-5 w-5 shrink-0 opacity-60 transition-[transform,opacity] duration-500 ease-out group-hover:-rotate-6 group-hover:scale-110 group-hover:opacity-100" />
                  </IdleIcon>
                  <span className="max-w-0 overflow-hidden font-accent text-[10px] tracking-[0.25em] whitespace-nowrap uppercase opacity-0 transition-all duration-500 ease-out group-hover:ml-2 group-hover:max-w-25 group-hover:opacity-100">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
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
          </button>
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
            className="fixed inset-0 z-40 flex flex-col bg-brand-black lg:hidden"
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
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
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
