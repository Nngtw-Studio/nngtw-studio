/** @format */

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SOCIAL } from '@/lib/constants';
import { cn } from '@/lib/utils';

export interface GamesNavItem {
  id: string;
  label: string;
  count?: number;
}

interface GamesSectionNavProps {
  items: GamesNavItem[];
}

/**
 * Slim glass chapter-nav that sticks under the viewport top once the hero
 * scrolls away. Scroll-spy highlights the chapter currently in view; anchors
 * ride the page's native smooth scrolling.
 */
export function GamesSectionNav({ items }: GamesSectionNavProps) {
  const [active, setActive] = useState<string | null>(null);
  /* The fixed site header (h-20, z-50) slides fully away when idle. Mirror
     its visibility off its own class list so this bar docks underneath it
     while it's shown and takes the viewport top once it hides. */
  const [headerVisible, setHeaderVisible] = useState(true);

  useEffect(() => {
    const header = document.querySelector('header');
    if (!(header instanceof HTMLElement)) return;
    const update = () =>
      setHeaderVisible(!header.classList.contains('-translate-y-full'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(header, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = items
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    /* The band between 30% and 45% of the viewport decides the active
       chapter — generous enough that long sections hold their highlight. */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-30% 0px -55% 0px' },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Games page sections"
      className={cn(
        'sticky z-30 border-y border-brand-white/5 bg-brand-bg/80 backdrop-blur-md transition-[top] duration-500',
        headerVisible ? 'top-20' : 'top-0',
      )}
    >
      <div className="relative mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-6 px-6 md:px-12 lg:px-20 xl:px-28">
        {/* Right-edge fade — hints that the chapter list scrolls on mobile */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-brand-bg to-transparent sm:hidden"
        />
        <div className="scrollbar-none flex h-full items-center gap-7 overflow-x-auto md:gap-10 [&::-webkit-scrollbar]:hidden">
          {items.map(({ id, label, count }) => {
            const isActive = active === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setActive(id)}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'cursor-target relative flex h-full shrink-0 items-center gap-2 label-overline transition-colors duration-300',
                  isActive
                    ? 'text-brand-white'
                    : 'text-brand-grey hover:text-brand-white/80',
                )}
              >
                {label}
                {typeof count === 'number' && count > 0 && (
                  <sup className="font-accent text-[9px] tracking-widest text-brand-orange">
                    {String(count).padStart(2, '0')}
                  </sup>
                )}
                {isActive && (
                  <motion.span
                    layoutId="games-nav-underline"
                    className="absolute inset-x-0 bottom-0 h-px bg-brand-orange"
                    transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                  />
                )}
              </a>
            );
          })}
        </div>

        <a
          href={SOCIAL.discord}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-target hidden shrink-0 items-center gap-2 label-overline text-brand-white/40 transition-colors duration-300 hover:text-brand-white sm:inline-flex"
        >
          Follow Development
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </nav>
  );
}
