/** @format */

import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';
import { technologyCategories } from '@/lib/data/content';

export function Technology() {
  return (
    <section className="section-padding mx-auto max-w-[1600px]">
      <FadeIn>
        <div className="mb-20 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label-overline mb-8 text-brand-grey/60">Our Technology</p>
            <h2 className="editorial-heading text-4xl text-brand-white md:text-5xl lg:text-6xl">
              Built with
              <br />
              the best
              <br />
              tools.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-7 lg:self-end">
            <p className="text-base leading-9 text-brand-grey">
              The platforms, engines, and frameworks we use to build games,
              applications, and immersive experiences — chosen for craft,
              not convenience.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Editorial table layout */}
      <StaggerContainer className="divide-y divide-brand-white/5">
        {technologyCategories.map((category, index) => (
          <StaggerItem key={category.id}>
            <div className="group grid gap-8 py-10 transition-colors duration-500 hover:bg-brand-white/1 lg:grid-cols-12 lg:items-start lg:gap-0 lg:py-12">
              {/* Category name — left column */}
              <div className="lg:col-span-4">
                <div className="flex items-center gap-4">
                  <span className="font-accent text-[10px] tracking-[0.3em] text-brand-grey/30">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-lg text-brand-white font-semibold tracking-tight">
                    {category.title}
                  </h3>
                </div>
                {category.description && (
                  <p className="mt-3 pl-9 text-xs leading-7 text-brand-grey/50 lg:max-w-55">
                    {category.description}
                  </p>
                )}
              </div>

              {/* Tool tags — right columns */}
              <div className="flex flex-wrap gap-2.5 lg:col-span-7 lg:col-start-6 lg:pt-1">
                {category.items.map((item) => (
                  <span
                    key={item}
                    className="border border-brand-white/8 px-4 py-2 font-accent text-[10px] tracking-[0.2em] uppercase text-brand-grey/60 transition-all duration-300 group-hover:border-brand-white/15 group-hover:text-brand-grey"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
