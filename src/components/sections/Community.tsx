'use client';

/** @format */

import { motion } from 'framer-motion';
import { FadeIn } from '@/components/motion/FadeIn';
import { Button } from '@/components/ui/Button';
import { SOCIAL } from '@/lib/constants';

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
  </svg>
);

const communityPillars = [
  {
    id: '01',
    title: 'Live Development Updates',
    description:
      'Follow progress as it happens. Devlogs, previews, and milestones before anyone else.',
  },
  {
    id: '02',
    title: 'Early Announcements',
    description:
      'Be first to know about new titles, major milestones, and launch dates.',
  },
  {
    id: '03',
    title: 'Playtest Access',
    description:
      'Join closed playtests and directly shape our games before they release.',
  },
  {
    id: '04',
    title: 'Direct Feedback',
    description:
      'Your ideas reach the team. We read every message and respond when we can.',
  },
  {
    id: '05',
    title: 'Behind the Scenes',
    description:
      'See how we design, prototype, and iterate — unfiltered and unscripted.',
  },
  {
    id: '06',
    title: 'Community Events',
    description:
      'Future giveaways, community game jams, and exclusive moments for members.',
  },
];

export function Community() {
  return (
    <section className="relative overflow-hidden bg-brand-black">
      {/* Atmosphere: very faint Discord blue bleeding in */}
      <div className="pointer-events-none absolute inset-0 bg-[#5865F2]/2" />
      <div className="pointer-events-none absolute -top-1/4 left-1/3 h-200 w-300 -translate-x-1/2 rounded-full bg-[#5865F2]/4 blur-[250px]" />

      <div className="section-padding relative mx-auto max-w-[1600px]">

        {/* Overline */}
        <FadeIn>
          <div className="mb-12 flex items-center gap-5">
            <DiscordIcon className="h-5 w-5 text-[#5865F2]/70" />
            <p className="label-overline text-brand-grey/60">Community</p>
          </div>
        </FadeIn>

        {/* Main layout: headline left, Discord card right */}
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">

          {/* Left — large headline + description + CTAs */}
          <div className="lg:col-span-6">
            <FadeIn>
              <h2 className="editorial-heading text-5xl text-brand-white md:text-6xl lg:text-7xl xl:text-8xl">
                Join
                <br />
                the
                <br />
                journey.
              </h2>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p className="mt-10 max-w-md text-base leading-9 text-brand-grey/70">
                Our Discord is where Nngtw Studio develops its games in public.
                Follow progress, shape decisions, and be there from the very
                beginning — not as an audience, but as part of the process.
              </p>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button href={SOCIAL.discord} variant="discord" size="lg" external>
                  Join Discord
                </Button>
                <Button href="/news" variant="secondary" size="lg">
                  Follow Development
                </Button>
              </div>
            </FadeIn>
          </div>

          {/* Right — Discord invite card */}
          <FadeIn
            delay={0.2}
            direction="left"
            className="lg:col-span-5 lg:col-start-8"
          >
            <div className="relative h-full">
              {/* Card */}
              <div className="border border-[#5865F2]/15 bg-[#5865F2]/5 p-10 lg:p-12 h-full flex flex-col justify-between min-h-80">
                {/* Discord brand mark */}
                <div className="flex items-start justify-between">
                  <DiscordIcon className="h-10 w-10 text-[#5865F2]" />
                  <motion.div
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="flex items-center gap-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    <span className="font-accent text-[9px] tracking-[0.3em] uppercase text-brand-grey/50">
                      Online
                    </span>
                  </motion.div>
                </div>

                {/* Server info */}
                <div className="mt-10">
                  <p className="font-display text-2xl font-semibold tracking-tight text-brand-white">
                    Nngtw Studio
                  </p>
                  <p className="mt-2 font-accent text-[10px] tracking-[0.35em] uppercase text-brand-grey/50">
                    Players · Developers · Creators
                  </p>
                </div>

                {/* Invite link */}
                <div className="mt-10 border-t border-[#5865F2]/15 pt-8">
                  <p className="label-overline text-brand-grey/40 mb-3">
                    Invite link
                  </p>
                  <p className="font-body text-sm text-brand-white/50 tracking-wide">
                    discord.gg/z3fpVJZkD
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* 6 community pillars */}
        <div className="mt-24 border-t border-brand-white/5 pt-16">
          <FadeIn>
            <p className="label-overline mb-12 text-brand-grey/40">
              What you get
            </p>
          </FadeIn>

          <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3 divide-y divide-brand-white/5 md:divide-y-0 md:divide-x md:divide-brand-white/5">
            {communityPillars.map((pillar, i) => (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.07, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="group px-0 py-8 md:px-8 md:first:pl-0 lg:px-10 lg:first:pl-0"
              >
                <span className="font-accent text-[10px] tracking-[0.3em] text-[#5865F2]/50">
                  {pillar.id}
                </span>
                <h4 className="mt-4 font-display text-base font-semibold tracking-tight text-brand-white/80 transition-colors duration-300 group-hover:text-brand-white">
                  {pillar.title}
                </h4>
                <p className="mt-3 text-xs leading-7 text-brand-grey/50">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
