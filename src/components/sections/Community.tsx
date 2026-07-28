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

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const communityPerks = [
  'Direct communication with game developers',
  'Exclusive early access & playtest builds',
  'Vote on upcoming features & game updates',
  'Behind-the-scenes concept art & dev logs',
];

const channels = [
  { name: '#announcements', active: true },
  { name: '#dev-logs', active: true },
  { name: '#game-feedback', active: false },
  { name: '#community-hangout', active: false },
];

export function Community() {
  return (
    <section className="relative snap-start overflow-hidden border-t border-brand-white/10 bg-brand-bg py-20 lg:py-32">
      {/* Dynamic Background Atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-radial from-[#5865F2]/10 via-transparent to-transparent blur-3xl opacity-60" />
      <div className="pointer-events-none absolute -top-40 right-10 h-[500px] w-[500px] rounded-full bg-[#5865F2]/15 blur-[160px]" />
      <div className="pointer-events-none absolute -bottom-40 left-10 h-[500px] w-[500px] rounded-full bg-brand-secondary/10 blur-[160px]" />

      <div className="section-padding relative mx-auto max-w-[1600px]">
        {/* Header Tag / Overline */}
        <FadeIn>
          <div className="mb-10 inline-flex items-center gap-3 rounded-full border border-[#5865F2]/30 bg-[#5865F2]/10 px-4 py-1.5 backdrop-blur-md">
            <DiscordIcon className="h-4 w-4 text-[#5865F2]" />
            <span className="font-accent text-xs tracking-[0.2em] uppercase text-brand-white/90 font-medium">
              Official Community Hub
            </span>
          </div>
        </FadeIn>

        {/* Main Grid Layout */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          {/* Left Column — Headline & Content */}
          <div className="lg:col-span-6">
            <FadeIn>
              <h2 className="editorial-heading text-4xl text-brand-white md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                Join the <br />
                <span className="bg-gradient-to-r from-[#5865F2] via-indigo-300 to-brand-secondary bg-clip-text text-transparent">
                  journey.
                </span>
              </h2>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-brand-grey/80">
                Our Discord is where Nngtw Studio develops games in public.
                Shape decisions, get early playtest access, and collaborate directly with our team.
              </p>
            </FadeIn>

            {/* Value Proposition Perks */}
            <FadeIn delay={0.2}>
              <ul className="mt-8 space-y-3.5 max-w-lg">
                {communityPerks.map((perk, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-brand-white/90">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5865F2]/20 text-[#7289DA] border border-[#5865F2]/40">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>

            {/* Action CTA Button */}
            <FadeIn delay={0.25}>
              <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
                <Button href={SOCIAL.discord} variant="discord" external>
                  Join Discord Server
                </Button>
              </div>
            </FadeIn>
          </div>

          {/* Right Column — Premium Interactive Glass Discord Card */}
          <FadeIn
            delay={0.2}
            direction="left"
            className="lg:col-span-6"
          >
            <a
              href={SOCIAL.discord}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join the Nngtw Studio Discord server"
              className="group relative block"
            >
              {/* Outer Card Glow on Hover */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#5865F2]/30 via-indigo-500/20 to-brand-secondary/30 opacity-40 blur-xl transition-all duration-500 group-hover:opacity-100 group-hover:blur-2xl" />

              {/* Main Glass Card Container */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-brand-black/60 p-8 md:p-10 backdrop-blur-xl shadow-2xl transition-all duration-500 group-hover:border-[#5865F2]/50 group-hover:bg-brand-black/80">
                
                {/* Header: Discord Brand Icon & Live Status Indicator */}
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5865F2] text-white shadow-lg shadow-[#5865F2]/30 transition-transform duration-500 group-hover:scale-105">
                      <DiscordIcon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-brand-white group-hover:text-[#5865F2] transition-colors duration-300">
                        Nngtw Studio
                      </h3>
                      <p className="font-accent text-xs tracking-wider uppercase text-brand-grey/60">
                        Official Server
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 backdrop-blur-md">
                    <motion.span
                      animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="h-2 w-2 rounded-full bg-green-400"
                    />
                    <span className="font-accent text-xs font-semibold uppercase tracking-wider text-green-400">
                      Online
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="my-6 space-y-5">
                  <p className="text-sm text-brand-grey/70 leading-relaxed">
                    Connect with players, developers, and creators. Get live game news and exclusive developer updates.
                  </p>

                  {/* Active Channels Chips */}
                  <div>
                    <span className="block font-accent text-[11px] font-medium tracking-widest text-brand-grey/50 uppercase mb-3">
                      Featured Channels
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {channels.map((ch, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-brand-white/80 transition-colors group-hover:border-[#5865F2]/30 group-hover:bg-[#5865F2]/10"
                        >
                          <span className="text-[#5865F2] font-mono">#</span>
                          {ch.name.substring(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer / Link Banner */}
                <div className="mt-8 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 transition-all duration-300 group-hover:border-[#5865F2]/40 group-hover:bg-[#5865F2]/10">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-brand-white/80">
                      Get the latest updates
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#5865F2] transition-transform duration-300 group-hover:translate-x-1">
                    Connect ↗
                  </span>
                </div>

              </div>
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

