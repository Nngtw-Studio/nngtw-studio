/** @format */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';
import { Button } from '@/components/ui/Button';
import type { Career } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * The careers page hero. Its job is to put whatever we're *actually*
 * hiring for above the fold — a candidate who lands here should see a
 * role they can apply to today without scrolling, not a wall of
 * aspirational future openings.
 *
 * `data-hero` is the site header's auto-hide contract (see the design
 * notes): the nav must not snap away while this section is on screen.
 */
export function CareersHero({
  openRoles,
  totalRoles,
}: {
  openRoles: Career[];
  totalRoles: number;
}) {
  const hiringNow = openRoles.length > 0;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!hiringNow || openRoles.length <= 1 || isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % openRoles.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [hiringNow, openRoles.length, isHovered]);

  return (
    <section
      data-hero
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pt-24 pb-8 md:pt-32 md:pb-12"
    >
      {/* Lighting rig — the two-corner radial convention every section uses. */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 h-[36rem] w-[36rem] rounded-full bg-brand-orange/8 blur-[160px]" />
        <div className="absolute -right-40 -bottom-52 h-[34rem] w-[34rem] rounded-full bg-brand-secondary/6 blur-[170px]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1600px] px-6 md:px-12 lg:px-20 xl:px-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Left: the pitch */}
          <div className="lg:col-span-5">
            <FadeIn>
              <div className="mb-8 flex items-center gap-4">
                <div className="accent-line" />
                <p className="label-overline text-brand-orange">Join Us</p>
              </div>

              <h1 className="editorial-heading text-5xl text-brand-white md:text-6xl lg:text-7xl">
                Build worlds
                <br />
                with us.
              </h1>

              <p className="mt-8 max-w-xl body-description">
                We&apos;re a small studio making original games and interactive
                products — which means the work you do here is visible in the
                thing that ships, not buried three layers down someone
                else&apos;s pipeline.
              </p>

              {hiringNow && (
                <div className="mt-8 inline-flex items-center gap-3 border border-brand-orange/25 bg-brand-orange/8 px-4 py-2">
                  {/* Pulsing dot: the one piece of motion in the hero, and it
                      only exists when there is genuinely something open. */}
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-orange/70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-orange" />
                  </span>
                  <p className="label-overline text-brand-orange">
                    {openRoles.length} role{openRoles.length === 1 ? '' : 's'} open now
                  </p>
                </div>
              )}
            </FadeIn>
          </div>

          {/* Right: the roles you can actually apply to today */}
          <div className="lg:col-span-7 lg:col-start-6">
            {hiringNow ? (
              <div 
                className="relative min-h-[360px] group/slider"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <SpotlightCard 
                      role={openRoles[currentIndex]} 
                      onNext={openRoles.length > 1 ? () => setCurrentIndex((prev) => (prev + 1) % openRoles.length) : undefined} 
                    />
                  </motion.div>
                </AnimatePresence>
                
                {openRoles.length > 1 && (
                  <div className="mt-8 flex items-center gap-3">
                    {openRoles.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          i === currentIndex ? 'w-8 bg-brand-orange' : 'w-2 bg-brand-white/20 hover:bg-brand-white/40'
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <FadeIn>
                <div className="glass-panel rounded-2xl p-8">
                  <p className="label-overline mb-4 text-brand-grey/50">
                    No open roles
                  </p>
                  <p className="body-description">
                    Nothing is open at this moment — but we hire in bursts, and
                    the roles below are the ones we expect to open next. Reach
                    out early and we&apos;ll come to you first.
                  </p>
                </div>
              </FadeIn>
            )}
          </div>
        </div>

        {/* The scroll cue — deliberately small. It's a signpost to the rest
            of the roster, not a competing call to action. */}
        <FadeIn className="mt-10 md:mt-12">
          <Link
            href="#all-roles"
            className="group inline-flex items-center gap-3 text-brand-grey/40 transition-colors duration-300 hover:text-brand-orange"
          >
            <span className="label-overline">
              All {totalRoles} opportunities
            </span>
            <span className="inline-block transition-transform duration-300 group-hover:translate-y-1">
              &darr;
            </span>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

/**
 * A hero-weight card for an open role: bigger type, the apply CTA inline,
 * and a hairline that lights up on hover. Kept distinct from the
 * `RoleCard` used in the full list so "you can apply to this today" reads
 * differently from "this exists."
 */
function SpotlightCard({ role, onNext }: { role: Career; onNext?: () => void }) {
  const applyHref = role.applyUrl ?? '/connect';

  return (
    <div className="group relative h-[420px] overflow-hidden rounded-[32px] border border-brand-white/8 bg-brand-white/[0.03] backdrop-blur-[2px] p-6 transition-colors duration-500 hover:border-brand-orange/50 md:h-[460px]">
      {/* Ambient Glows */}
      <div
        className="pointer-events-none absolute top-16 left-0 z-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px] transition-all duration-700 bg-brand-orange/[0.04] group-hover:bg-brand-orange/[0.05]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 z-0 h-[800px] w-[800px] translate-x-1/2 translate-y-1/2 rounded-full blur-[110px] transition-all duration-700 bg-brand-orange/[0.04] group-hover:bg-brand-orange/[0.05]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 animate-sway rounded-full blur-[150px] transition-all duration-700 bg-brand-secondary/[0.02] group-hover:bg-brand-secondary/[0.04]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full flex-col">
        <div>
          <div className="flex items-start justify-between gap-4">
            <Link href={`/careers/${role.slug}`} className="block max-w-[70%]">
              <p className="label-overline mb-3 text-brand-grey/60">Role</p>
              <h2 className="editorial-heading text-2xl text-brand-white transition-colors duration-300 md:text-3xl">
                {role.title}
              </h2>
            </Link>
            <div className="flex flex-col items-end text-right gap-1 mt-1">
              <span className="label-overline font-semibold text-brand-white/90">REMOTE</span>
              <span className="label-overline font-semibold text-brand-white/90">{role.type}</span>
            </div>
          </div>

          <div className="mt-6">
            <p className="label-overline mb-3 text-brand-grey/60">Requirements</p>
            <div className="flex flex-col gap-2.5">
              {role.requirements.filter(r => !r.toLowerCase().startsWith('nice to have:')).map((req, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-brand-orange">—</span>
                  <span className="body-description line-clamp-2">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-x-8 gap-y-3">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-0 sm:-space-x-2">
            <Button
              href={applyHref}
              variant="primary"
              external={Boolean(role.applyUrl)}
            >
              Apply Now
            </Button>
            <Button
              href={`/careers/${role.slug}`}
              variant="secondary"
            >
              Read Full Role
            </Button>
          </div>
        </div>
      </div>

      {onNext && (
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-20 flex w-[64px] items-center justify-end opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {/* Gradient fade from right to left (orange) */}
          <div className="absolute inset-0 bg-gradient-to-l from-brand-orange/10 to-transparent" />
          
          <button
            onClick={(e) => {
              e.preventDefault();
              onNext();
            }}
            className="pointer-events-auto relative z-30 flex h-full w-full items-center justify-end pl-2 pr-[6px] text-brand-white transition-transform duration-300 hover:scale-110"
            aria-label="Next role"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
