/** @format */

import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';
import { getPhilosophyValues } from '@/lib/supabase/queries/philosophy';

export async function StudioPhilosophy() {
  const philosophyValues = await getPhilosophyValues();
  return (
    <section className="relative overflow-hidden bg-brand-black">
      <div className="section-padding mx-auto max-w-[1600px]">

        {/* Header */}
        <FadeIn>
          <div className="mb-20 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="label-overline mb-8 text-brand-grey/60">Studio Philosophy</p>
              <h2 className="editorial-heading text-4xl text-brand-white md:text-5xl lg:text-6xl">
                The principles
                <br />
                behind every
                <br />
                decision.
              </h2>
            </div>
          </div>
        </FadeIn>

        {/* Numbered editorial list — 2 columns on desktop */}
        <StaggerContainer className="grid gap-0 md:grid-cols-2 divide-y divide-brand-white/5 md:divide-y-0">
          {philosophyValues.map((value, index) => (
            <StaggerItem key={value.id}>
              <div className="group flex gap-8 border-b border-brand-white/5 py-10 md:py-12 md:px-2 transition-colors duration-500 hover:bg-brand-white/1.5">
                {/* Number */}
                <span className="font-accent text-[11px] tracking-[0.25em] text-brand-grey/25 pt-1 shrink-0 w-8">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Content */}
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-brand-white transition-colors duration-300 group-hover:text-brand-white">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-8 text-brand-grey/70">
                    {value.description}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
