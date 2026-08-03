/** @format */

'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { GAME_ART } from '@/lib/data/game-art';
import { gameStatusLabels } from '@/lib/data/content';
import { cn } from '@/lib/utils';
import type { Game } from '@/types';

const SLIDE_MS = 15000;
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ACCENT = {
  orange: {
    badge: 'border-brand-orange/35 bg-brand-orange/12 text-brand-orange',
    bar: 'bg-brand-orange',
  },
  pink: {
    badge: 'border-brand-secondary/35 bg-brand-secondary/12 text-brand-secondary',
    bar: 'bg-brand-secondary',
  },
} as const;

function accentFor(game: Game, index: number) {
  return ACCENT[GAME_ART[game.slug]?.accent ?? (index % 2 === 1 ? 'pink' : 'orange')];
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

/**
 * One backdrop layer per featured title. Tries the curated key art first,
 * then the game's banner, then a brand gradient — so the hero always has a
 * full-bleed image even before final art lands in /public/games.
 */
function HeroBackdrop({
  game,
  active,
  priority,
}: {
  game: Game;
  active: boolean;
  priority: boolean;
}) {
  const candidates = useMemo(
    () =>
      [GAME_ART[game.slug]?.thumbnail, game.bannerImageUrl].filter(
        (s): s is string => Boolean(s),
      ),
    [game],
  );
  const [srcIndex, setSrcIndex] = useState(0);
  const src = candidates[srcIndex] ?? null;

  return (
    <motion.div
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 1.4, ease: 'easeInOut' }}
      className="absolute inset-0"
      aria-hidden="true"
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          priority={priority}
          sizes="100vw"
          onError={() => setSrcIndex((i) => i + 1)}
          className={cn(
            'object-cover',
            active && 'motion-safe:animate-ken-burns',
          )}
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-brand-orange/12 via-brand-black to-brand-bg" />
      )}
    </motion.div>
  );
}

/** Wordmark lockup with graceful fallback to a typeset title. */
function SlideLogo({ game }: { game: Game }) {
  const src = GAME_ART[game.slug]?.logo ?? game.logoImageUrl ?? null;
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <h2 className="editorial-heading text-4xl text-brand-white sm:text-5xl md:text-6xl">
        {game.title}
      </h2>
    );
  }

  return (
    <div className="relative h-20 w-full max-w-105 sm:h-24 md:h-28">
      <Image
        src={src}
        alt={`${game.title} logo`}
        fill
        sizes="420px"
        onError={() => setFailed(true)}
        className="object-contain object-left mix-blend-screen"
      />
      <h2 className="sr-only">{game.title}</h2>
    </div>
  );
}

interface GamesHeroProps {
  games: Game[];
  /** Number of concept-stage titles — shown in the hero's footer stats. */
  conceptCount?: number;
}

/**
 * Cinematic landing for /games: full-bleed key art of the titles in active
 * development, crossfading on an 8s cycle, with the featured title's
 * wordmark, meta, and CTAs riding the lower third — the page's editorial
 * identity holds the upper left.
 */
export function GamesHero({ games, conceptCount = 0 }: GamesHeroProps) {
  const count = games.length;
  const [active, setActive] = useState(0);
  /* Bumped on every slide change (auto or manual) so the selector's progress
     bar remounts and restarts even when the slide index repeats. */
  const [cycle, setCycle] = useState(0);

  const { matches: isLg, mounted } = useMediaQuery('(min-width: 1024px)');
  const isDesktop = mounted && isLg;

  useEffect(() => {
    if (count < 2) return;
    const id = setTimeout(() => {
      setActive((a) => (a + 1) % count);
      setCycle((c) => c + 1);
    }, SLIDE_MS);
    return () => clearTimeout(id);
  }, [active, cycle, count]);

  const select = (i: number) => {
    if (i === active) return;
    setActive(i);
    setCycle((c) => c + 1);
  };

  const game = games[active] ?? null;

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const springConfig = { damping: 40, stiffness: 100, mass: 1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  const bgX = useTransform(springX, [0, 1], ['-1.5%', '1.5%']);
  const bgY = useTransform(springY, [0, 1], ['-1.5%', '1.5%']);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX / innerWidth);
    mouseY.set(clientY / innerHeight);
  };

  return (
    <MotionConfig reducedMotion="user">
      <section
        data-hero
        id="games-hero"
        aria-label="Featured games"
        className="relative snap-start flex min-h-svh flex-col overflow-hidden bg-brand-bg"
        onMouseMove={handleMouseMove}
      >
        {/* Key art backdrops */}
        <motion.div 
          className="absolute inset-0 scale-[1.05] [mask-image:radial-gradient(ellipse_at_75%_50%,black_0%,black_35%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_at_75%_50%,black_0%,black_35%,transparent_100%)]"
          style={{ x: bgX, y: bgY }}
        >
          {games.map((g, i) => (
            <HeroBackdrop key={g.id} game={g} active={i === active} priority={i === 0} />
          ))}
        </motion.div>

        {/* Bottom edge feathering to merge seamlessly with the section below */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[300px] bg-linear-to-t from-brand-bg via-brand-bg/60 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-brand-bg/60 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[100px] bg-linear-to-b from-brand-black/30 to-transparent"
          aria-hidden="true"
        />

        {/* Ambient brand lighting — same rig language as the homepage */}
        <div
          className="pointer-events-none absolute inset-0 opacity-70 mix-blend-screen"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 55% 40% at 8% 12%, rgba(245,138,31,0.06), transparent 65%), radial-gradient(ellipse 50% 45% at 94% 88%, rgba(223,19,138,0.05), transparent 68%)',
          }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-between px-6 pt-36 pb-8 md:px-12 md:pt-40 lg:px-20 xl:px-28">
          {/* Editorial identity — static while the slides rotate beneath it */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4">
              <div className="accent-line" />
              <p className="label-overline text-brand-orange drop-shadow-md">Our Games</p>
            </div>
            <h1 className="editorial-heading mt-6 max-w-3xl text-4xl leading-tight tracking-tight text-brand-white drop-shadow-[0_4px_32px_rgba(0,0,0,0.8)] sm:text-5xl lg:text-6xl">
              Worlds built
              <br />
              to be played.
            </h1>
          </motion.div>

          {/* Featured slide + title selector */}
          <div className="mt-8 grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7" aria-live="polite">
              {game && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={game.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.a
                      href={game.projectLink ?? `/games/${game.slug}`}
                      className="group relative block w-full overflow-hidden rounded-[28px] border border-brand-white/10 bg-brand-black/15 p-6 backdrop-blur-[2px] transition-all duration-500 ease-out hover:border-brand-white/20 sm:p-8"
                    >
                      {/* Large subtle background number */}
                      <div className="pointer-events-none absolute -right-6 -top-12 select-none font-sans text-[16rem] font-black leading-none tracking-tighter text-brand-white/[0.03] transition-colors group-hover:text-brand-white/[0.05]">
                        {String(active + 1).padStart(2, '0')}
                      </div>

                      {/* Status Badge moved to top right */}
                      <div className="absolute right-8 top-8 z-20">
                        <span
                          className={cn(
                            'inline-flex w-fit items-center border px-4 py-1.5 label-overline backdrop-blur-sm',
                            accentFor(game, active).badge,
                          )}
                        >
                          {gameStatusLabels[game.status] ?? 'In Development'}
                        </span>
                      </div>

                      <div className="relative z-10">
                        <div className="transition-transform duration-500 ease-out group-hover:scale-105 group-hover:origin-left">
                          <SlideLogo game={game} />
                        </div>

                        <p className="mt-4 max-w-md text-sm leading-7 text-brand-white/85 line-clamp-3 drop-shadow-sm md:text-base md:leading-8">
                          {game.description}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                          <span className="font-accent text-[10px] tracking-[0.28em] text-brand-white/70 uppercase drop-shadow-sm">
                            {game.genre}
                          </span>
                          <span className="text-brand-white/30">·</span>
                          <span className="font-accent text-[10px] tracking-[0.28em] text-brand-white/50 uppercase drop-shadow-sm">
                            {game.platforms.join(' · ')}
                          </span>
                          <span className="text-brand-white/30">·</span>
                          <span className="font-accent text-[10px] tracking-[0.28em] text-brand-white/50 uppercase drop-shadow-sm">
                            {game.engine}
                          </span>
                        </div>

                        <div className="mt-8 flex items-center font-secondary text-[18px] font-semibold text-brand-orange">
                          <span className="tracking-[0.01em] transition-[letter-spacing] duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] group-hover:tracking-[0.1em]">
                            View details
                          </span>
                          <span className="ml-2.5 inline-flex origin-left pt-0.75 transition-transform group-hover:animate-jello-vertical">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="45"
                              height="18"
                              viewBox="0 0 38 15"
                              fill="none"
                            >
                              <path
                                fill="currentColor"
                                d="M10 7.519l-.939-.344h0l.939.344zm14.386-1.205l-.981-.192.981.192zm1.276 5.509l.537.843.148-.094.107-.139-.792-.611zm4.819-4.304l-.385-.923h0l.385.923zm7.227.707a1 1 0 0 0 0-1.414L31.343.448a1 1 0 0 0-1.414 0 1 1 0 0 0 0 1.414l5.657 5.657-5.657 5.657a1 1 0 0 0 1.414 1.414l6.364-6.364zM1 7.519l.554.833.029-.019.094-.061.361-.23 1.277-.77c1.054-.609 2.397-1.32 3.629-1.787.617-.234 1.17-.392 1.623-.455.477-.066.707-.008.788.034.025.013.031.021.039.034a.56.56 0 0 1 .058.235c.029.327-.047.906-.39 1.842l1.878.689c.383-1.044.571-1.949.505-2.705-.072-.815-.45-1.493-1.16-1.865-.627-.329-1.358-.332-1.993-.244-.659.092-1.367.305-2.056.566-1.381.523-2.833 1.297-3.921 1.925l-1.341.808-.385.245-.104.068-.028.018c-.011.007-.011.007.543.84zm8.061-.344c-.198.54-.328 1.038-.36 1.484-.032.441.024.94.325 1.364.319.45.786.64 1.21.697.403.054.824-.001 1.21-.09.775-.179 1.694-.566 2.633-1.014l3.023-1.554c2.115-1.122 4.107-2.168 5.476-2.524.329-.086.573-.117.742-.115s.195.038.161.014c-.15-.105.085-.139-.076.685l1.963.384c.192-.98.152-2.083-.74-2.707-.405-.283-.868-.37-1.28-.376s-.849.069-1.274.179c-1.65.43-3.888 1.621-5.909 2.693l-2.948 1.517c-.92.439-1.673.743-2.221.87-.276.064-.429.065-.492.057-.043-.006.066.003.155.127.07.099.024.131.038-.063.014-.187.078-.49.243-.94l-1.878-.689zm14.343-1.053c-.361 1.844-.474 3.185-.413 4.161.059.95.294 1.72.811 2.215.567.544 1.242.546 1.664.459a2.34 2.34 0 0 0 .502-.167l.15-.076.049-.028.018-.011c.013-.008.013-.008-.524-.852l-.536-.844.019-.012c-.038.018-.064.027-.084.032-.037.008.053-.013.125.056.021.02-.151-.135-.198-.895-.046-.734.034-1.887.38-3.652l-1.963-.384zm2.257 5.701l.791.611.024-.031.08-.101.311-.377 1.093-1.213c.922-.954 2.005-1.894 2.904-2.27l-.771-1.846c-1.31.547-2.637 1.758-3.572 2.725l-1.184 1.314-.341.414-.093.117-.025.032c-.01.013-.01.013.781.624zm5.204-3.381c.989-.413 1.791-.42 2.697-.307.871.108 2.083.385 3.437.385v-2c-1.197 0-2.041-.226-3.19-.369-1.114-.139-2.297-.146-3.715.447l.771 1.846z"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </motion.a>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>


          </div>
        </div>

        {/* Scroll cue — vertical composition in the bottom-right corner */}
        <motion.div
          initial={false}
          animate={isDesktop ? "visible" : "hidden"}
          variants={{
            visible: {
              clipPath: [
                "inset(100% 0 100% 0)", 
                "inset(10% 0 10% 0)", 
                "inset(10% 0 10% 0)", 
                "inset(0% 0 0% 0)"
              ],
              transition: { times: [0, 0.3, 0.7, 1], duration: 0.8, ease: "easeInOut" }
            },
            hidden: {
              clipPath: [
                "inset(0% 0 0% 0)", 
                "inset(10% 0 10% 0)", 
                "inset(10% 0 10% 0)", 
                "inset(100% 0 100% 0)"
              ],
              transition: { times: [0, 0.3, 0.7, 1], duration: 0.8, ease: "easeInOut" }
            }
          }}
          className="absolute bottom-11 right-6 z-10 hidden md:right-12 lg:right-20 lg:block [@media(max-height:619px)]:hidden"
        >
          <button
            type="button"
            onClick={() => {
              document.getElementById('games-hero')?.nextElementSibling?.scrollIntoView({ behavior: 'smooth' });
            }}
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
          </button>
        </motion.div>
      </section>
    </MotionConfig>
  );
}
