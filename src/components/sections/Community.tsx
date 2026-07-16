'use client';

/** @format */

import { motion } from 'framer-motion';
import { FadeIn } from '@/components/motion/FadeIn';
import { CtaButton } from '@/components/ui/CtaButton';
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

export function Community() {
  return (
    <section className="relative overflow-hidden border-t border-brand-white/5 bg-brand-black">
      {/* Atmosphere: very faint Discord blue bleeding in */}
      <div className="pointer-events-none absolute inset-0 bg-[#5865F2]/2" />
      <div className="pointer-events-none absolute -top-1/4 left-1/3 h-200 w-300 -translate-x-1/2 rounded-full bg-[#5865F2]/4 blur-[250px]" />

      <div className="section-padding relative mx-auto max-w-[1600px]">

        {/* Overline */}
        <FadeIn>
          <div className="mb-12 flex items-center gap-5">
            <DiscordIcon className="h-5 w-5 text-[#5865F2]/70" />
            <p className="label-overline text-brand-orange">Community</p>
          </div>
        </FadeIn>

        {/* Main layout: headline left, Discord card right */}
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">

          {/* Left — large headline + description + CTAs */}
          <div className="lg:col-span-6">
            <FadeIn>
              <h2 className="editorial-heading text-4xl text-brand-white md:text-5xl lg:text-6xl">
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
              <div className="mt-12 flex flex-col items-start gap-4 xl:flex-row">
                <CtaButton href={SOCIAL.discord} variant="discord" external>
                  Join Discord
                </CtaButton>
                <CtaButton href="/news" variant="secondary">
                  Follow Development
                </CtaButton>
              </div>
            </FadeIn>
          </div>

          {/* Right — Discord invite card */}
          <FadeIn
            delay={0.2}
            direction="left"
            className="lg:col-span-5 lg:col-start-8"
          >
            <a
              href={SOCIAL.discord}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join the Nngtw Studio Discord server"
              className="cursor-target group relative block h-full"
            >
              {/* Card — the whole invite is clickable */}
              <div className="flex h-full min-h-80 flex-col justify-between rounded-2xl border border-[#5865F2]/15 bg-[#5865F2]/5 p-10 transition-colors duration-500 group-hover:border-[#5865F2]/40 group-hover:bg-[#5865F2]/8 lg:p-12">
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
                  <p className="font-body text-sm tracking-wide text-brand-white/50 transition-colors duration-300 group-hover:text-brand-white/80">
                    discord.gg/z3fpVJZkD
                  </p>
                </div>
              </div>
            </a>
          </FadeIn>
        </div>

      </div>
    </section>
  );
}
