/** @format */

import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from '@/components/motion/FadeIn';
import { lifeAppsContent } from '@/lib/data/life-apps';

/**
 * Gamified Life Apps — the studio's chapter beyond games. Runs on the pink
 * side of the brand palette so it reads as its own initiative while staying
 * inside the same lighting language as the rest of the site.
 */
export function LifeAppsSection() {
  return (
    <section
      id="life-apps"
      aria-label="Gamified life apps"
      className="relative snap-start scroll-mt-36 overflow-hidden border-t border-brand-white/5"
    >
      {/* Pink-led ambient rig — flips the site's usual orange/pink balance */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 90% 10%, rgba(223,19,138,0.09), transparent 65%), radial-gradient(ellipse 50% 45% at 6% 90%, rgba(245,138,31,0.06), transparent 68%)',
        }}
      />

      <div className="section-padding relative mx-auto max-w-[1600px]">
        {/* Section header */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <FadeIn className="lg:col-span-7">
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px w-10 bg-brand-secondary" />
              <p className="label-overline text-brand-secondary">
                {lifeAppsContent.label}
              </p>
            </div>
            <h2 className="editorial-heading text-4xl text-brand-white md:text-5xl lg:text-6xl">
              {lifeAppsContent.title}
              <span className="text-brand-secondary">.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-4 lg:col-start-9 lg:pb-2">
            <p className="text-base leading-8 text-brand-grey">
              {lifeAppsContent.intro}
            </p>
          </FadeIn>
        </div>

        {/* Design pillars */}
        <StaggerContainer className="mt-16 grid gap-6 md:mt-20 md:grid-cols-3">
          {lifeAppsContent.pillars.map((pillar, index) => (
            <StaggerItem key={pillar.id} className="h-full">
              <article className="glass-panel group relative flex h-full flex-col overflow-hidden p-8 transition-colors duration-500 hover:border-brand-secondary/30 md:p-10">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-4 right-4 font-display text-[5.5rem] leading-none font-black text-brand-white/5 select-none transition-colors duration-500 group-hover:text-brand-white/9"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="relative flex h-full flex-col">
                  <span className="inline-flex w-fit items-center border border-brand-secondary/30 bg-brand-secondary/8 px-3 py-1 label-overline text-[10px] text-brand-secondary">
                    {pillar.status}
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-brand-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 font-accent text-[10px] tracking-[0.26em] text-brand-white/45 uppercase">
                    {pillar.tagline}
                  </p>
                  <p className="mt-5 flex-1 text-sm leading-7 text-brand-grey">
                    {pillar.description}
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Status note */}
        <FadeIn className="mt-14 md:mt-16">
          <p className="mx-auto max-w-2xl text-center text-sm leading-8 text-brand-grey">
            {lifeAppsContent.note}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
