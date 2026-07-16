/** @format */

import { FadeIn } from '@/components/motion/FadeIn';

interface PageHeaderProps {
  label?: string;
  title: string;
  description?: string;
}

export function PageHeader({ label, title, description }: PageHeaderProps) {
  return (
    /* data-hero: the site header treats this as the page's hero — the nav
       never snap-hides while it's on screen. */
    <section data-hero className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
      {/* Very subtle warm glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-75 w-150 -translate-x-1/2 rounded-full bg-brand-white/1 blur-[140px]" />
      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20 xl:px-28">
        <FadeIn>
          {label && (
            <p className="label-overline mb-8 text-brand-grey/60">{label}</p>
          )}
          <h1 className="editorial-heading max-w-4xl text-5xl text-brand-white md:text-6xl lg:text-7xl xl:text-8xl">
            {title}
          </h1>
          {description && (
            <p className="mt-8 max-w-2xl text-base leading-9 text-brand-grey/70 md:text-lg">
              {description}
            </p>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
