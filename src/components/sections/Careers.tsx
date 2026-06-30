/** @format */

import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';
import { Button } from '@/components/ui/Button';
import { careerStatusLabels } from '@/lib/data/content';
import { getActiveCareers } from '@/lib/supabase/queries/careers';
import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  open: 'border-green-500/25 bg-green-500/8 text-green-400',
  internship: 'border-brand-orange/25 bg-brand-orange/8 text-brand-orange',
  future: 'border-brand-white/15 bg-brand-white/4 text-brand-grey/60',
  closed: 'border-red-500/15 bg-red-500/5 text-red-400/50',
};

export async function Careers() {
  const highlighted = await getActiveCareers(6);

  return (
    <section className="relative overflow-hidden bg-brand-black">
      <div className="section-padding mx-auto max-w-[1600px]">

        {/* Header */}
        <FadeIn>
          <div className="mb-16 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="label-overline mb-8 text-brand-grey/60">Careers</p>
              <h2 className="editorial-heading text-4xl text-brand-white md:text-5xl lg:text-6xl">
                Join the
                <br />
                team.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:col-start-7 lg:self-end">
              <p className="text-base leading-9 text-brand-grey/70">
                We&apos;re building a team of passionate creators. While most
                roles are future opportunities, we&apos;re always interested in
                hearing from talented people who share our vision.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Role list */}
        <StaggerContainer className="divide-y divide-brand-white/5">
          {highlighted.map((career) => (
            <StaggerItem key={career.id}>
              <Link
                href={`/careers/${career.slug}`}
                className="group flex flex-col gap-4 py-7 transition-colors duration-300 md:flex-row md:items-center md:justify-between md:py-8"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <h3 className="font-display text-base font-semibold tracking-tight text-brand-white/80 transition-colors duration-300 group-hover:text-brand-white md:text-lg">
                    {career.title}
                  </h3>
                  <span
                    className={cn(
                      'inline-block border px-2.5 py-0.5 label-overline',
                      statusStyles[career.status],
                    )}
                  >
                    {careerStatusLabels[career.status]}
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <p className="font-accent text-[10px] tracking-[0.2em] uppercase text-brand-grey/40">
                    {career.department}&ensp;·&ensp;{career.location}&ensp;·&ensp;{career.type}
                  </p>
                  <span className="font-accent text-[10px] tracking-[0.25em] uppercase text-brand-grey/30 transition-colors duration-300 group-hover:text-brand-white/60">
                    &rarr;
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn className="mt-14 text-center">
          <Button href="/careers" variant="secondary">
            View All Opportunities
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
