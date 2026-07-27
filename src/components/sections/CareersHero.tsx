/** @format */

import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';
import { Button } from '@/components/ui/Button';
import type { Career } from '@/types';

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

  return (
    <section
      data-hero
      className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-20"
    >
      {/* Lighting rig — the two-corner radial convention every section uses. */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 h-[36rem] w-[36rem] rounded-full bg-brand-orange/8 blur-[160px]" />
        <div className="absolute -right-40 -bottom-52 h-[34rem] w-[34rem] rounded-full bg-brand-secondary/6 blur-[170px]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20 xl:px-28">
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

              <p className="mt-8 max-w-xl text-base leading-9 text-brand-grey/70">
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
          <div className="lg:col-span-6 lg:col-start-7">
            {hiringNow ? (
              <StaggerContainer className="flex flex-col gap-4">
                {openRoles.map((role) => (
                  <StaggerItem key={role.id}>
                    <SpotlightCard role={role} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <FadeIn>
                <div className="glass-panel rounded-2xl p-8">
                  <p className="label-overline mb-4 text-brand-grey/50">
                    No open roles
                  </p>
                  <p className="text-base leading-8 text-brand-grey/70">
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
        <FadeIn className="mt-16 md:mt-20">
          <Link
            href="#all-roles"
            className="cursor-target group inline-flex items-center gap-3 text-brand-grey/40 transition-colors duration-300 hover:text-brand-orange"
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
function SpotlightCard({ role }: { role: Career }) {
  const applyHref = role.applyUrl ?? '/connect';

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-brand-white/8 bg-brand-white/2 p-7 transition-all duration-500 hover:border-brand-orange/30 md:p-8">
      {/* Sheen that sweeps in from the leading edge on hover. */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-brand-orange/4 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      <div className="relative">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="border border-brand-orange/25 bg-brand-orange/10 px-2.5 py-0.5 label-overline text-brand-orange">
            {role.type}
          </span>
          <p className="font-accent text-[10px] tracking-[0.2em] uppercase text-brand-grey/40">
            {role.department}&ensp;·&ensp;{role.location}
          </p>
        </div>

        <Link href={`/careers/${role.slug}`} className="cursor-target">
          <h2 className="editorial-heading text-2xl text-brand-white transition-colors duration-300 group-hover:text-brand-orange md:text-3xl">
            {role.title}
          </h2>
        </Link>

        {/* Clamped: the hero is a hook, the detail page is the pitch. */}
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-brand-grey/60">
          {role.description}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
          {/* -ml-5 pulls the CtaButton's reserved 320px slot back into
              alignment with the text above it — the documented fix. */}
          <div className="-ml-5">
            <Button
              href={applyHref}
              variant="primary"
              external={Boolean(role.applyUrl)}
            >
              Apply Now
            </Button>
          </div>
          <Link
            href={`/careers/${role.slug}`}
            className="cursor-target font-accent text-[10px] tracking-[0.25em] uppercase text-brand-grey/40 transition-colors duration-300 hover:text-brand-white"
          >
            Read the full role &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
