/** @format */

import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';

/** Editorial pillars distilled from the studio's positioning */
const PILLARS = [
  {
    label: 'We make',
    title: 'Original games',
    body: 'Worlds for PC and mobile, built to be returned to.',
  },
  {
    label: 'We work',
    title: 'Player-first',
    body: 'Fair monetization. Design that respects the player.',
  },
  {
    label: 'We believe',
    title: 'Craft over scale',
    body: 'Quality is independent of budget.',
  },
  {
    label: 'Next',
    title: 'XR and beyond',
    body: 'Immersive tech — XR, VR, mixed reality.',
  },
];

export function AboutStudio() {
  return (
    <section
      id="about-studio"
      className="relative snap-start overflow-hidden border-t border-brand-white/5 bg-brand-black"
    >
      {/* Ambient treatment — a faint brand-orange bloom behind the heading */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-140 w-140 rounded-full bg-brand-orange/5 blur-[140px]"
      />

      <div className="section-padding relative mx-auto max-w-[1600px]">
        {/* Studio intro — asymmetric 2-column */}
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="lg:col-span-5">
            <div className="mb-8 flex items-center gap-4">
              <div className="accent-line" />
              <p className="label-overline text-brand-orange">About Nngtw Studio</p>
            </div>
            <h2 className="editorial-heading text-4xl text-brand-white md:text-5xl lg:text-6xl">
              An independent
              <br />
              studio crafting
              <br />
              immersive
              <br />
              experiences.
            </h2>

            {/* Grounding line under the heading */}
            <p className="mt-10 max-w-sm border-l border-brand-orange/40 pl-6 font-accent text-[11px] leading-6 tracking-[0.25em] text-brand-grey/60 uppercase">
              Imagine · Explore · Evolve
            </p>
          </FadeIn>

          <FadeIn delay={0.15} className="lg:col-span-6 lg:col-start-7 lg:pt-4">
            {/* Lede — bigger, brighter, sets the voice */}
            <p className="font-display text-xl leading-relaxed font-medium tracking-tight text-brand-white/90 md:text-2xl md:leading-relaxed">
              Original games for PC and mobile — built by a small, growing
              team.
            </p>

            <div className="mt-8 space-y-6 text-base leading-8 text-brand-grey">
              <p>
                Player-first experiences, fair monetization, and worlds worth
                returning to. We compete on craft, not scale.
              </p>
              <p>
                Next up: interactive apps and immersive tech — XR, VR, and
                mixed reality.
              </p>
            </div>

            <Link
              href="/studio"
              className="group mt-12 inline-flex items-center gap-4 border border-brand-white/15 px-8 py-4 label-overline text-brand-white transition-colors duration-300 hover:border-brand-orange/60 hover:text-brand-orange"
            >
              Meet the Studio
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          </FadeIn>
        </div>

        {/* Pillars — the studio, at a glance */}
        <StaggerContainer className="mt-24 grid border-y border-brand-white/5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar, index) => (
            <StaggerItem key={pillar.title}>
              <div
                className={`group h-full px-2 py-10 transition-colors duration-500 hover:bg-brand-white/1.5 sm:px-6 lg:py-12 ${
                  index > 0 ? 'border-t border-brand-white/5 sm:border-t-0 lg:border-l' : ''
                } ${index >= 2 ? 'lg:border-t-0' : ''} ${
                  index === 2 ? 'sm:border-l lg:border-t-0' : ''
                }`}
              >
                <p className="font-accent text-[10px] tracking-[0.25em] text-brand-grey/40 uppercase transition-colors duration-500 group-hover:text-brand-orange/70">
                  {pillar.label}
                </p>
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-brand-white">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-brand-grey/70">{pillar.body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
