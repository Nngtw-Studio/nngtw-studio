import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/sections/ContactForm";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { BRAND, SOCIAL, STUDIO_EMAILS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Connect",
  description:
    "Connect with Nngtw Studio — studio, support, careers, and community channels, plus a direct message form.",
};

/* ── Icons ───────────────────────────────────────────────────────────────── */

const DISCORD_PATH =
  "M11.343 5.177c-1.076 0-4.32 1.316-4.902 1.579-.582.263-1.228 1.084-1.961 2.439-.734 1.355-1.323 2.939-2.28 5.269-.956 2.33-1.179 6.822-1.147 8.193.032 1.371.189 2.442 1.594 3.253 1.404.81 2.646 1.658 3.953 2.168 1.308.51 2.2.877 2.806.367.606-.51 1.005-1.403 1.005-1.403s.574-.797-.51-1.275c-1.084-.479-1.626-.814-1.579-1.308.048-.494.127-.765.398-.701.271.064.91 1.211 3.365 1.737s4.848.447 4.848.447 2.394.08 4.849-.447c2.455-.526 3.093-1.673 3.364-1.737.271-.064.35.207.398.7.048.495-.494.83-1.578 1.309-1.084.478-.51 1.275-.51 1.275s.399.892 1.005 1.403c.605.51 1.498.143 2.805-.367 1.307-.51 2.55-1.357 3.954-2.168 1.405-.811 1.562-1.882 1.594-3.253.032-1.37-.191-5.863-1.148-8.193-.956-2.33-1.546-3.914-2.28-5.269-.732-1.355-1.379-2.176-1.96-2.44-.582-.262-3.827-1.578-4.903-1.578-1.076 0-1.394.75-1.394.75l-.375.829s-2.52-.479-3.804-.48c-1.284 0-3.837.48-3.837.48l-.375-.83s-.318-.749-1.395-.749zm.117 9.948h.04c1.569 0 2.84 1.373 2.84 3.066 0 1.694-1.271 3.066-2.84 3.066s-2.84-1.372-2.84-3.066c-.001-1.677 1.247-3.043 2.8-3.066zm10.907 0h.04c1.553.023 2.8 1.39 2.8 3.066 0 1.694-1.271 3.066-2.84 3.066-1.57 0-2.84-1.372-2.84-3.066 0-1.693 1.27-3.066 2.84-3.066z";

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 33.867 33.867" fill="currentColor" aria-hidden="true">
    <path d={DISCORD_PATH} />
  </svg>
);

const ArrowIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

/* ── Inboxes (bento) ─────────────────────────────────────────────────────── */

interface Inbox {
  label: string;
  email: string;
  blurb: string;
  span: string;
  primary?: boolean;
  icon: React.ReactNode;
}

const inboxes: Inbox[] = [
  {
    label: "The studio",
    email: STUDIO_EMAILS.studio,
    blurb:
      "Our main address. Partnerships, publishing, press, investors, legal — anything that belongs on the studio's desk.",
    span: "lg:col-span-2",
    primary: true,
    icon: <MailIcon className="h-5 w-5" />,
  },
  {
    label: "Game support",
    email: STUDIO_EMAILS.support,
    blurb: "Bugs, crashes, accounts, and anything that went wrong in one of our games.",
    span: "lg:col-span-1",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M6 12h4M8 10v4M15 11h.01M18 13h.01" />
        <path d="M17.32 5H6.68a4 4 0 0 0-3.95 3.36l-1.2 7.2A3 3 0 0 0 4.5 19c1 0 1.8-.5 2.4-1.2L8.5 16h7l1.6 1.8c.6.7 1.4 1.2 2.4 1.2a3 3 0 0 0 2.97-3.44l-1.2-7.2A4 4 0 0 0 17.32 5Z" />
      </svg>
    ),
  },
  {
    label: "Careers",
    email: STUDIO_EMAILS.careers,
    blurb: "Applications, internships, and hiring questions.",
    span: "lg:col-span-1",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M2 13h20" />
      </svg>
    ),
  },
  {
    label: "General contact",
    email: STUDIO_EMAILS.contact,
    blurb: "Not sure where it fits? Send it here and we'll route it.",
    span: "lg:col-span-2",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
];

/* ── Socials — matches the homepage hero set ─────────────────────────────── */

const socials = [
  {
    label: "LinkedIn",
    handle: "Nngtw Studio",
    href: SOCIAL.linkedin,
    accent: "#0A66C2",
    icon: (
      <svg className="h-4.5 w-4.5" viewBox="0 0 25 24" fill="currentColor" aria-hidden="true">
        <path d="m5.706 7.798v16.202h-5.395v-16.202zm.343-5.002c.001.029.002.063.002.098 0 .749-.318 1.423-.826 1.895l-.002.001c-.545.498-1.274.803-2.075.803-.049 0-.099-.001-.148-.003h.007-.033c-.041.002-.089.003-.137.003-.784 0-1.496-.306-2.025-.804l.001.001c-.504-.488-.816-1.17-.816-1.925 0-.024 0-.048.001-.073v.004c-.001-.021-.001-.045-.001-.069 0-.762.324-1.448.841-1.929l.002-.001c.544-.495 1.271-.799 2.068-.799.046 0 .091.001.137.003h-.006c.043-.002.092-.003.143-.003.785 0 1.5.303 2.034.798l-.002-.002c.515.497.835 1.193.835 1.964v.042-.002zm19.062 11.92v9.284h-5.378v-8.665c.005-.079.007-.171.007-.263 0-.896-.249-1.733-.682-2.447l.012.021c-.427-.596-1.117-.979-1.896-.979-.06 0-.12.002-.18.007h.008c-.027-.001-.058-.002-.089-.002-.62 0-1.19.213-1.641.57l.006-.004c-.453.367-.808.836-1.032 1.375l-.008.023c-.116.355-.182.763-.182 1.187 0 .048.001.096.003.144v-.007 9.042h-5.378q.033-6.523.033-10.578t-.016-4.839l-.016-.785h5.378v2.354h-.033c.214-.345.435-.644.678-.924l-.008.009c.281-.309.583-.588.908-.838l.016-.012c.404-.311.878-.555 1.392-.704l.03-.007c.538-.161 1.157-.254 1.797-.254h.079-.004c.071-.003.154-.005.237-.005 1.681 0 3.195.714 4.256 1.856l.003.004q1.702 1.856 1.702 5.436z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    handle: "@nngtwstudio",
    href: SOCIAL.instagram,
    accent: "#df138a",
    icon: (
      <svg className="h-4.5 w-4.5" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
        <circle cx="128" cy="128" r="32" />
        <path d="M172,28H84A56.06353,56.06353,0,0,0,28,84v88a56.06353,56.06353,0,0,0,56,56h88a56.06353,56.06353,0,0,0,56-56V84A56.06353,56.06353,0,0,0,172,28ZM128,176a48,48,0,1,1,48-48A48.05436,48.05436,0,0,1,128,176Zm52-88a12,12,0,1,1,12-12A12,12,0,0,1,180,88Z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    handle: "Nngtw Studio",
    href: SOCIAL.facebook,
    accent: "#1877F2",
    icon: (
      <svg className="h-4.5 w-4.5" viewBox="0 0 25.26 47.17" fill="currentColor" aria-hidden="true">
        <path d="M23.61 26.53 24.92 18h-8.19v-5.54c0-2.34 1.14-4.62 4.81-4.62h3.72V.58A45.17 45.17 0 0 0 18.65 0C11.91 0 7.5 4.09 7.5 11.49V18H0v8.54h7.5v20.63h9.23V26.53Z" />
      </svg>
    ),
  },
];

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function ConnectPage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════
          HERO
         ═══════════════════════════════════════════════════════════════════════ */}
      <section data-hero className="relative overflow-hidden pt-36 pb-4 md:pt-44">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 12% 0%, rgba(245,138,31,0.10), transparent 65%), radial-gradient(ellipse 55% 50% at 95% 30%, rgba(223,19,138,0.07), transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20 xl:px-28">
          <FadeIn>
            <div className="mb-8 flex items-center gap-4">
              <div className="accent-line" />
              <p className="label-overline text-brand-orange">Communication Hub</p>
            </div>
          </FadeIn>

          <div className="grid items-end gap-10 lg:grid-cols-12">
            <FadeIn className="lg:col-span-7">
              <h1 className="editorial-heading text-5xl text-brand-white md:text-7xl lg:text-8xl">
                Hey. Need
                <br />
                <span className="text-brand-orange">something?</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.15} className="lg:col-span-4 lg:col-start-9">
              <p className="max-w-md text-base leading-8 text-brand-grey/70">
                Pick the inbox that fits, jump into Discord, or send us a message right
                here. Whichever you choose, it reaches a real person at the studio.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          BENTO — inboxes, community, socials
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-24 lg:px-20 xl:px-28">
          <FadeIn>
            <p className="label-overline mb-8 text-brand-grey/50">Reach us directly</p>
          </FadeIn>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.07}>
            {/* Discord — the big one */}
            <StaggerItem className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
              <DiscordCard />
            </StaggerItem>

            {inboxes.map((inbox) => (
              <StaggerItem key={inbox.email} className={cn("h-full", inbox.span)}>
                <InboxCard inbox={inbox} />
              </StaggerItem>
            ))}

            {/* Socials */}
            <StaggerItem className="sm:col-span-2 lg:col-span-2">
              <SocialCard />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          MESSAGE FORM
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t border-brand-white/5">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 50% 45% at 5% 15%, rgba(245,138,31,0.05), transparent 65%), radial-gradient(ellipse 50% 50% at 95% 85%, rgba(223,19,138,0.04), transparent 68%)",
          }}
        />

        <div className="relative mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-28 lg:px-20 xl:px-28">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <FadeIn>
                <p className="label-overline text-brand-grey/50">Send a message</p>
                <h2 className="editorial-heading mt-6 text-4xl text-brand-white md:text-5xl">
                  Let&apos;s get
                  <br />
                  in touch.
                </h2>
                <p className="mt-7 max-w-md text-base leading-8 text-brand-grey/70">
                  Tell us what the message is about so it lands with the right person, then
                  keep it short and specific — the clearer the ask, the faster the reply.
                </p>
              </FadeIn>

              <FadeIn delay={0.12}>
                <dl className="mt-10 max-w-md space-y-0 border-t border-brand-white/8">
                  {[
                    { term: "Typical reply", detail: "Within 2 business days" },
                    { term: "Faster answers", detail: "Ask in Discord — the team is there daily" },
                    { term: "Attachments", detail: "Email the relevant inbox instead" },
                  ].map((row) => (
                    <div
                      key={row.term}
                      className="flex items-baseline gap-6 border-b border-brand-white/8 py-4"
                    >
                      <dt className="w-32 shrink-0 text-xs tracking-[0.18em] text-brand-grey uppercase">
                        {row.term}
                      </dt>
                      <dd className="text-sm text-brand-white/80">{row.detail}</dd>
                    </div>
                  ))}
                </dl>
              </FadeIn>
            </div>

            <FadeIn delay={0.15} direction="left" className="lg:col-span-6 lg:col-start-7">
              <div className="relative overflow-hidden rounded-[28px] border border-brand-white/8 bg-brand-white/[0.02] p-7 backdrop-blur-sm md:p-10">
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand-white/20 to-transparent"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-brand-orange/8 blur-[100px]"
                  aria-hidden="true"
                />
                <div className="relative">
                  <ContactForm />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CAREERS STRIP
         ═══════════════════════════════════════════════════════════════════════ */}
      <Link
        href="/careers"
        className="group relative block overflow-hidden bg-brand-orange"
      >
        <span className="absolute inset-0 origin-left scale-x-0 bg-brand-black/85 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100" />
        <span className="relative flex items-center justify-center gap-5 px-6 py-9 md:py-11">
          <span className="editorial-heading text-2xl text-brand-black transition-colors duration-500 group-hover:text-brand-orange md:text-4xl">
            Want to join NNGTW? Careers
          </span>
          <ArrowIcon className="h-6 w-6 shrink-0 text-brand-black transition-all duration-500 group-hover:translate-x-2 group-hover:text-brand-orange md:h-8 md:w-8" />
        </span>
      </Link>

      {/* ═══════════════════════════════════════════════════════════════════════
          ABOUT NNGTW
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-28 lg:px-20 xl:px-28">
          <FadeIn>
            <div className="relative overflow-hidden rounded-[32px] border border-brand-white/8 bg-brand-white/[0.03] p-8 md:p-14">
              <div
                className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-brand-orange/8 blur-[120px]"
                aria-hidden="true"
              />
              <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-7">
                  <p className="label-overline text-brand-grey/50">About NNGTW</p>
                  <h2 className="editorial-heading mt-6 text-3xl text-brand-white md:text-5xl">
                    An independent studio,
                    <br />
                    building in the open.
                  </h2>
                  <p className="mt-7 max-w-xl text-base leading-8 text-brand-grey/70">
                    {BRAND.description} Get to know the team, the tech, and what
                    we&apos;re working on next.
                  </p>
                </div>
                <div className="lg:col-span-4 lg:col-start-9 lg:justify-self-end">
                  <Button href="/studio" variant="primary" className="-ml-5 lg:ml-0">
                    Our Studio
                  </Button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function DiscordCard() {
  return (
    <a
      href={SOCIAL.discord}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-[#5865F2]/25 bg-[#5865F2]/[0.06] p-8 transition-colors duration-500 hover:border-[#5865F2]/50 hover:bg-[#5865F2]/[0.1] md:p-10"
    >
      <div
        className="pointer-events-none absolute -top-20 -right-10 h-64 w-64 rounded-full bg-[#5865F2]/20 blur-[110px]"
        aria-hidden="true"
      />
      <DiscordIcon className="pointer-events-none absolute -right-6 -bottom-10 h-52 w-52 text-[#5865F2]/8 transition-transform duration-700 group-hover:scale-105" />

      <div className="relative">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#5865F2]/30 text-[#5865F2] transition-colors duration-300 group-hover:border-[#5865F2]/60">
          <DiscordIcon className="h-6 w-6" />
        </span>
        <h3 className="editorial-heading mt-7 text-3xl text-brand-white md:text-4xl">
          The community
          <br />
          lives on Discord.
        </h3>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-brand-grey">
          Dev updates, playtests, fan art, events, and the fastest way to get an answer
          from someone on the team.
        </p>
      </div>

      <div className="relative mt-10 flex items-center gap-3">
        <span className="inline-flex items-center gap-3 rounded-full bg-[#5865F2] px-6 py-3 font-display text-xs tracking-widest whitespace-nowrap text-white uppercase transition-colors duration-300 group-hover:bg-[#6B77F5]">
          Join Discord
          <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
        <span className="hidden truncate text-xs text-brand-grey sm:block">
          discord.gg/z3fpVJZkD
        </span>
      </div>
    </a>
  );
}

function InboxCard({ inbox }: { inbox: Inbox }) {
  return (
    <a
      href={`mailto:${inbox.email}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 transition-all duration-500",
        inbox.primary
          ? "border-brand-orange/25 bg-brand-orange/[0.05] hover:border-brand-orange/45 hover:bg-brand-orange/[0.08]"
          : "border-brand-white/8 bg-brand-white/[0.02] hover:border-brand-white/18 hover:bg-brand-white/[0.05]"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300",
            inbox.primary
              ? "border-brand-orange/35 text-brand-orange"
              : "border-brand-white/10 text-brand-grey/60 group-hover:border-brand-orange/40 group-hover:text-brand-orange"
          )}
        >
          {inbox.icon}
        </span>
        <ArrowIcon className="h-4 w-4 shrink-0 text-brand-white/20 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brand-orange" />
      </div>

      <p className="mt-6 text-xs tracking-[0.2em] text-brand-grey uppercase">{inbox.label}</p>
      <p
        className={cn(
          "mt-2 font-display tracking-wide break-all transition-colors duration-300",
          inbox.primary
            ? "text-xl text-brand-orange md:text-2xl"
            : "text-base text-brand-white group-hover:text-brand-orange"
        )}
      >
        {inbox.email}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-brand-grey">{inbox.blurb}</p>
    </a>
  );
}

function SocialCard() {
  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-brand-white/8 bg-brand-white/[0.02] p-7">
      <div>
        <p className="text-xs tracking-[0.2em] text-brand-grey uppercase">Follow the studio</p>
        <p className="mt-3 text-sm leading-relaxed text-brand-grey">
          Announcements, work-in-progress, and behind-the-scenes from the team.
        </p>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            style={
              {
                "--accent": social.accent,
                "--accent-soft": `color-mix(in srgb, ${social.accent} 40%, transparent)`,
              } as React.CSSProperties
            }
            className="group flex items-center gap-3 rounded-2xl border border-brand-white/8 bg-brand-white/[0.02] p-3.5 transition-colors duration-300 hover:border-(--accent-soft) hover:bg-brand-white/[0.05]"
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand-white/10 text-brand-grey/60 transition-colors duration-300 group-hover:border-(--accent-soft) group-hover:text-(--accent)">
              {social.icon}
            </span>
            <span className="min-w-0">
              <span className="block text-sm text-brand-white">{social.label}</span>
              <span className="block truncate text-xs text-brand-grey">{social.handle}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
