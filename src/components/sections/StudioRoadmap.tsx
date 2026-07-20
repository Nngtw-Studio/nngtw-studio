/** @format */

import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';
import { studioContent } from '@/lib/data/content';

const EXPLORE_LINKS = [
  { href: '/games', label: 'See what we’re building' },
  { href: '/technology', label: 'Explore our technology' },
];

/** Long-term goals as a numbered editorial ledger — commitments, not bullets. */
export function StudioRoadmap() {
  return (
    <section className="relative snap-start overflow-hidden border-t border-brand-white/5 bg-brand-black">
      {/* Ambient treatment — bloom swings back left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 h-140 w-140 rounded-full bg-brand-orange/4 blur-[140px]"
      />

      <div className="section-padding relative mx-auto max-w-[1600px]">
        <FadeIn>
          <div className="mb-16 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="mb-8 flex items-center gap-4">
                <div className="accent-line" />
                <p className="label-overline text-brand-orange">The Road Ahead</p>
              </div>
              <h2 className="editorial-heading text-4xl text-brand-white md:text-5xl lg:text-6xl">
                Where we&apos;re
                <br />
                headed.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:col-start-7 lg:self-end">
              <p className="text-base leading-9 text-brand-grey/70">
                Five commitments guiding the studio — from the titles in
                development today to the immersive realities we&apos;re building
                toward.
              </p>
            </div>
          </div>
        </FadeIn>

        <StaggerContainer className="divide-y divide-brand-white/5 border-y border-brand-white/5">
          {studioContent.longTermGoals.map((goal, index) => (
            <StaggerItem key={goal}>
              <div className="group flex items-baseline gap-8 py-8 transition-colors duration-500 hover:bg-brand-white/1.5 md:gap-12 md:px-2 md:py-10">
                <span className="w-8 shrink-0 font-accent text-[11px] tracking-[0.25em] text-brand-grey/25 transition-colors duration-500 group-hover:text-brand-orange/70">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="font-display text-lg leading-snug font-medium tracking-tight text-brand-white/80 transition-colors duration-500 group-hover:text-brand-white md:text-2xl">
                  {goal}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Quiet onward links — the roadmap points at the rest of the site */}
        <FadeIn className="mt-14 flex flex-col gap-6 sm:flex-row sm:gap-14">
          {EXPLORE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="cursor-target group inline-flex items-center gap-3 font-accent text-[11px] tracking-[0.25em] text-brand-grey/60 uppercase transition-colors duration-300 hover:text-brand-orange"
            >
              {link.label}
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                &rarr;
              </span>
            </Link>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
