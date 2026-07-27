/** @format */

import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';
import { Button } from '@/components/ui/Button';

/** Studio statements — what defines Nngtw, one line each */
const STATEMENTS = [
  'We build original worlds — not reskins.',
  'Fair monetization. Always. No dark patterns.',
  'Quality is independent of budget.',
  'We develop in public — players shape the build.',
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
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <FadeIn className="lg:col-span-5">
            <div className="mb-6 flex items-center gap-4">
              <div className="accent-line" />
              <p className="label-overline text-brand-orange">The Studio</p>
            </div>
            <h2 className="editorial-heading text-4xl text-brand-white md:text-5xl lg:text-6xl">
              Independent.
              <br />
              Obsessive.
              <br />
              Small on purpose.
            </h2>

            {/* Grounding line under the heading */}
            <p className="mt-9 max-w-sm border-l border-brand-orange/40 pl-6 font-accent text-[11px] leading-6 tracking-[0.25em] text-brand-grey/60 uppercase">
              Imagine · Explore · Evolve
            </p>

            <Button href="/studio" variant="secondary" className="mt-10">
              Meet the Studio
            </Button>
          </FadeIn>

          {/* Statement rows — the studio, at a glance */}
          <StaggerContainer className="lg:col-span-6 lg:col-start-7 lg:pt-1">
            <div className="border-t border-brand-white/8">
              {STATEMENTS.map((statement, index) => (
                <StaggerItem key={statement}>
                  <div className="group flex gap-7 border-b border-brand-white/8 py-8 transition-[background-color,padding-left] duration-300 hover:bg-brand-white/2.5 hover:pl-5">
                    <span className="shrink-0 pt-1 font-accent text-[10px] tracking-[0.24em] text-brand-orange/75">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="font-display text-xl leading-snug font-medium tracking-tight text-brand-white/90 md:text-2xl">
                      {statement}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
