/** @format */

import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';
import { studioContent } from '@/lib/data/content';

/** The development philosophy distilled into four working beats. */
const STEPS = [
  {
    number: '01',
    title: 'Prototype',
    body: 'Ideas become playable fast — we test the fun before anything else.',
  },
  {
    number: '02',
    title: 'Iterate',
    body: 'Builds evolve in the open, shaped by community feedback on Discord.',
  },
  {
    number: '03',
    title: 'Polish',
    body: 'We refine until every interaction feels intentional.',
  },
  {
    number: '04',
    title: 'Ship',
    body: 'Released when ready — then supported for years, not months.',
  },
];

export function StudioProcess() {
  return (
    <section className="relative snap-start overflow-hidden border-t border-brand-white/5 bg-brand-black">
      {/* Ambient treatment — bloom swings right for section rhythm */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-140 w-140 rounded-full bg-brand-orange/4 blur-[140px]"
      />

      <div className="section-padding relative mx-auto max-w-[1600px]">
        <FadeIn>
          <div className="mb-20 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="mb-8 flex items-center gap-4">
                <div className="accent-line" />
                <p className="label-overline text-brand-orange">How We Work</p>
              </div>
              <h2 className="editorial-heading text-4xl text-brand-white md:text-5xl lg:text-6xl">
                From spark
                <br />
                to shipped.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:col-start-7 lg:self-end">
              <p className="text-base leading-9 text-brand-grey">
                {studioContent.developmentPhilosophy}
              </p>
            </div>
          </div>
        </FadeIn>

        {/* The four beats — pillar grid, matching the About section's rhythm */}
        <StaggerContainer className="grid border-y border-brand-white/5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <StaggerItem key={step.title}>
              <div
                className={`group h-full px-2 py-10 transition-colors duration-500 hover:bg-brand-white/1.5 sm:px-6 lg:py-12 ${
                  index > 0 ? 'border-t border-brand-white/5 sm:border-t-0 lg:border-l' : ''
                } ${index >= 2 ? 'lg:border-t-0' : ''} ${
                  index === 2 ? 'sm:border-l lg:border-t-0' : ''
                }`}
              >
                <p className="font-accent text-[10px] tracking-[0.25em] text-brand-grey/40 uppercase transition-colors duration-500 group-hover:text-brand-orange/70">
                  Step {step.number}
                </p>
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-brand-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-brand-grey/70">{step.body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
