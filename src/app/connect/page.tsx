import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { BRAND, SOCIAL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Connect",
  description:
    "Connect with Nngtw Studio — the official communication hub for partnerships, press, investors, legal, community, and game support.",
};

/* ── Communication cards ─────────────────────────────────────────────────── */

interface CommCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  items?: string[];
  actions?: { label: string; href: string; external?: boolean; primary?: boolean }[];
  highlight?: boolean;
}

const communicationCards: CommCard[] = [
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M21 6H3M21 12H3M21 18H3" />
        <path d="M15 6l-3 3-3-3M15 12l-3 3-3-3" />
      </svg>
    ),
    title: "Game Support",
    description: "Need help with one of our games? Bug reports, player reports, technical issues, and gameplay support should be submitted through the game itself or its dedicated support page.",
    actions: [
      { label: "Visit Game Support", href: "/games", primary: true },
      { label: "Open Game Pages", href: "/games" },
      { label: "Join Discord", href: SOCIAL.discord, external: true },
    ],
  },
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Business & Partnerships",
    description: "For publishing, platform partnerships, brand collaborations, licensing, and sponsorship opportunities.",
    items: ["Publishing", "Platform partnerships", "Brand collaborations", "Licensing", "Sponsorship opportunities"],
    actions: [{ label: "Email us", href: `mailto:${BRAND.email}`, external: true, primary: true }],
  },
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0V4" />
        <path d="M8 7h8M8 11h8M8 15h5" />
      </svg>
    ),
    title: "Press & Media",
    description: "For interviews, press kits, creator requests, media inquiries, and event invitations.",
    items: ["Interviews", "Press kits", "Creator requests", "Media inquiries", "Event invitations"],
    actions: [{ label: "Email us", href: `mailto:${BRAND.email}`, external: true, primary: true }],
  },
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "Investors",
    description: "For investment opportunities, strategic partnerships, and corporate discussions.",
    items: ["Investment opportunities", "Strategic partnerships", "Corporate discussions"],
    actions: [{ label: "Email us", href: `mailto:${BRAND.email}`, external: true, primary: true }],
  },
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Legal",
    description: "For copyright, trademark, privacy requests, and legal notices.",
    items: ["Copyright", "Trademark", "Privacy requests", "Legal notices"],
    actions: [{ label: "Email us", href: `mailto:${BRAND.email}`, external: true, primary: true }],
  },
];

const communityCard: CommCard = {
  icon: (
    <svg className="h-7 w-7" viewBox="0 0 33.867 33.867" fill="currentColor" aria-hidden="true">
      <path d="M11.343 5.177c-1.076 0-4.32 1.316-4.902 1.579-.582.263-1.228 1.084-1.961 2.439-.734 1.355-1.323 2.939-2.28 5.269-.956 2.33-1.179 6.822-1.147 8.193.032 1.371.189 2.442 1.594 3.253 1.404.81 2.646 1.658 3.953 2.168 1.308.51 2.2.877 2.806.367.606-.51 1.005-1.403 1.005-1.403s.574-.797-.51-1.275c-1.084-.479-1.626-.814-1.579-1.308.048-.494.127-.765.398-.701.271.064.91 1.211 3.365 1.737s4.848.447 4.848.447 2.394.08 4.849-.447c2.455-.526 3.093-1.673 3.364-1.737.271-.064.35.207.398.7.048.495-.494.83-1.578 1.309-1.084.478-.51 1.275-.51 1.275s.399.892 1.005 1.403c.605.51 1.498.143 2.805-.367 1.307-.51 2.55-1.357 3.954-2.168 1.405-.811 1.562-1.882 1.594-3.253.032-1.37-.191-5.863-1.148-8.193-.956-2.33-1.546-3.914-2.28-5.269-.732-1.355-1.379-2.176-1.96-2.44-.582-.262-3.827-1.578-4.903-1.578-1.076 0-1.394.75-1.394.75l-.375.829s-2.52-.479-3.804-.48c-1.284 0-3.837.48-3.837.48l-.375-.83s-.318-.749-1.395-.749zm.117 9.948h.04c1.569 0 2.84 1.373 2.84 3.066 0 1.694-1.271 3.066-2.84 3.066s-2.84-1.372-2.84-3.066c-.001-1.677 1.247-3.043 2.8-3.066zm10.907 0h.04c1.553.023 2.8 1.39 2.8 3.066 0 1.694-1.271 3.066-2.84 3.066-1.57 0-2.84-1.372-2.84-3.066 0-1.693 1.27-3.066 2.84-3.066z" />
    </svg>
  ),
  title: "Community",
  description: "Discord is our primary community hub. Join us to share fan art, discuss our games, meet other players, participate in events, and showcase your creations.",
  items: ["Share fan art", "Discuss our games", "Meet other players", "Participate in events", "Showcase your creations"],
  highlight: true,
  actions: [{ label: "Join Discord", href: SOCIAL.discord, external: true, primary: true }],
};

/* ── Official channels ───────────────────────────────────────────────────── */

const officialChannels = [
  {
    label: "Email",
    href: `mailto:${BRAND.email}`,
    value: BRAND.email,
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: "Discord",
    href: SOCIAL.discord,
    value: "discord.gg/z3fpVJZkD",
    external: true,
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 33.867 33.867" fill="currentColor" aria-hidden="true">
        <path d="M11.343 5.177c-1.076 0-4.32 1.316-4.902 1.579-.582.263-1.228 1.084-1.961 2.439-.734 1.355-1.323 2.939-2.28 5.269-.956 2.33-1.179 6.822-1.147 8.193.032 1.371.189 2.442 1.594 3.253 1.404.81 2.646 1.658 3.953 2.168 1.308.51 2.2.877 2.806.367.606-.51 1.005-1.403 1.005-1.403s.574-.797-.51-1.275c-1.084-.479-1.626-.814-1.579-1.308.048-.494.127-.765.398-.701.271.064.91 1.211 3.365 1.737s4.848.447 4.848.447 2.394.08 4.849-.447c2.455-.526 3.093-1.673 3.364-1.737.271-.064.35.207.398.7.048.495-.494.83-1.578 1.309-1.084.478-.51 1.275-.51 1.275s.399.892 1.005 1.403c.605.51 1.498.143 2.805-.367 1.307-.51 2.55-1.357 3.954-2.168 1.405-.811 1.562-1.882 1.594-3.253.032-1.37-.191-5.863-1.148-8.193-.956-2.33-1.546-3.914-2.28-5.269-.732-1.355-1.379-2.176-1.96-2.44-.582-.262-3.827-1.578-4.903-1.578-1.076 0-1.394.75-1.394.75l-.375.829s-2.52-.479-3.804-.48c-1.284 0-3.837.48-3.837.48l-.375-.83s-.318-.749-1.395-.749zm.117 9.948h.04c1.569 0 2.84 1.373 2.84 3.066 0 1.694-1.271 3.066-2.84 3.066s-2.84-1.372-2.84-3.066c-.001-1.677 1.247-3.043 2.8-3.066zm10.907 0h.04c1.553.023 2.8 1.39 2.8 3.066 0 1.694-1.271 3.066-2.84 3.066-1.57 0-2.84-1.372-2.84-3.066 0-1.693 1.27-3.066 2.84-3.066z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: SOCIAL.linkedin,
    value: "Nngtw Studio",
    external: true,
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 25 24" fill="currentColor" aria-hidden="true">
        <path d="m5.706 7.798v16.202h-5.395v-16.202zm.343-5.002c.001.029.002.063.002.098 0 .749-.318 1.423-.826 1.895l-.002.001c-.545.498-1.274.803-2.075.803-.049 0-.099-.001-.148-.003h.007-.033c-.041.002-.089.003-.137.003-.784 0-1.496-.306-2.025-.804l.001.001c-.504-.488-.816-1.17-.816-1.925 0-.024 0-.048.001-.073v.004c-.001-.021-.001-.045-.001-.069 0-.762.324-1.448.841-1.929l.002-.001c.544-.495 1.271-.799 2.068-.799.046 0 .091.001.137.003h-.006c.043-.002.092-.003.143-.003.785 0 1.5.303 2.034.798l-.002-.002c.515.497.835 1.193.835 1.964v.042-.002zm19.062 11.92v9.284h-5.378v-8.665c.005-.079.007-.171.007-.263 0-.896-.249-1.733-.682-2.447l.012.021c-.427-.596-1.117-.979-1.896-.979-.06 0-.12.002-.18.007h.008c-.027-.001-.058-.002-.089-.002-.62 0-1.19.213-1.641.57l.006-.004c-.453.367-.808.836-1.032 1.375l-.008.023c-.116.355-.182.763-.182 1.187 0 .048.001.096.003.144v-.007 9.042h-5.378q.033-6.523.033-10.578t-.016-4.839l-.016-.785h5.378v2.354h-.033c.214-.345.435-.644.678-.924l-.008.009c.281-.309.583-.588.908-.838l.016-.012c.404-.311.878-.555 1.392-.704l.03-.007c.538-.161 1.157-.254 1.797-.254h.079-.004c.071-.003.154-.005.237-.005 1.681 0 3.195.714 4.256 1.856l.003.004q1.702 1.856 1.702 5.436z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: SOCIAL.x,
    value: "@nngtw_studio",
    external: true,
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: SOCIAL.instagram,
    value: "@nngtwstudio",
    external: true,
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
        <circle cx="128" cy="128" r="32" />
        <path d="M172,28H84A56.06353,56.06353,0,0,0,28,84v88a56.06353,56.06353,0,0,0,56,56h88a56.06353,56.06353,0,0,0,56-56V84A56.06353,56.06353,0,0,0,172,28ZM128,176a48,48,0,1,1,48-48A48.05436,48.05436,0,0,1,128,176Zm52-88a12,12,0,1,1,12-12A12,12,0,0,1,180,88Z" />
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
      <PageHeader
        label="Communication Hub"
        title="Connect"
        description="Whether you're reaching out about publishing, partnerships, media, legal matters, or game support, this is the best place to connect with Nngtw Studio."
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          COMMUNICATION CARDS
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Atmosphere */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 8% 20%, rgba(245,138,31,0.05), transparent 65%), radial-gradient(ellipse 50% 50% at 92% 80%, rgba(223,19,138,0.04), transparent 68%)",
          }}
        />

        <div className="relative mx-auto max-w-[1600px] px-6 pb-24 md:px-12 lg:px-20">
          {/* Section overline */}
          <FadeIn>
            <div className="mb-12 flex items-center gap-4">
              <div className="accent-line" />
              <p className="label-overline text-brand-orange">Where to reach us</p>
            </div>
          </FadeIn>

          {/* Cards grid */}
          <StaggerContainer
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.08}
          >
            {communicationCards.map((card) => (
              <StaggerItem key={card.title}>
                <CommCardComponent card={card} />
              </StaggerItem>
            ))}

            {/* Community card — spans 2 columns on large screens */}
            <StaggerItem className="sm:col-span-2 lg:col-span-2">
              <CommCardComponent card={communityCard} />
            </StaggerItem>

            {/* Careers card */}
            <StaggerItem>
              <CareersCard />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          OFFICIAL CHANNELS
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t border-brand-white/5">
        <div className="relative mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32 lg:px-20">
          <FadeIn>
            <div className="mb-12 flex items-center gap-4">
              <div className="accent-line" />
              <p className="label-overline text-brand-orange">Official Channels</p>
            </div>
          </FadeIn>

          <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
            <FadeIn className="lg:col-span-5">
              <h2 className="editorial-heading text-3xl text-brand-white md:text-4xl lg:text-5xl">
                Stay in the loop.
              </h2>
              <p className="mt-6 max-w-md text-base leading-8 text-brand-grey/70">
                Follow us across our official channels for announcements, behind-the-scenes content, and direct updates from the studio.
              </p>
            </FadeIn>

            <FadeIn delay={0.15} className="lg:col-span-6 lg:col-start-7">
              <StaggerContainer className="space-y-0" stagger={0.06}>
                {officialChannels.map((ch) => (
                  <StaggerItem key={ch.label}>
                    <a
                      href={ch.href}
                      target={ch.external ? "_blank" : undefined}
                      rel={ch.external ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-4 border-b border-brand-white/5 py-5 transition-colors hover:border-brand-white/10"
                    >
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-brand-white/10 text-brand-grey/50 transition-all duration-300 group-hover:border-brand-orange/30 group-hover:text-brand-orange">
                        {ch.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs tracking-[0.2em] text-brand-grey uppercase">
                          {ch.label}
                        </p>
                        <p className="mt-0.5 truncate text-sm text-brand-white transition-colors duration-300 group-hover:text-brand-orange">
                          {ch.value}
                        </p>
                      </div>
                      <svg
                        className="ml-auto h-3.5 w-3.5 shrink-0 text-brand-white/20 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brand-white/40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </a>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          DISCORD COMMUNITY SECTION
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative snap-start overflow-hidden border-t border-brand-white/5">
        {/* Atmosphere: faint Discord blue */}
        <div className="pointer-events-none absolute inset-0 bg-[#5865F2]/[0.02]" />
        <div
          className="pointer-events-none absolute -top-1/4 left-1/3 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-[#5865F2]/[0.04] blur-[200px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-1/4 right-1/4 h-[400px] w-[500px] rounded-full bg-brand-orange/[0.03] blur-[180px]"
          aria-hidden="true"
        />

        <div className="section-padding relative mx-auto max-w-[1600px]">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
            {/* Left — headline + description */}
            <div className="lg:col-span-6">
              <FadeIn>
                <div className="mb-8 flex items-center gap-5">
                  <svg className="h-5 w-5 text-[#5865F2]/70" viewBox="0 0 33.867 33.867" fill="currentColor" aria-hidden="true">
                    <path d="M11.343 5.177c-1.076 0-4.32 1.316-4.902 1.579-.582.263-1.228 1.084-1.961 2.439-.734 1.355-1.323 2.939-2.28 5.269-.956 2.33-1.179 6.822-1.147 8.193.032 1.371.189 2.442 1.594 3.253 1.404.81 2.646 1.658 3.953 2.168 1.308.51 2.2.877 2.806.367.606-.51 1.005-1.403 1.005-1.403s.574-.797-.51-1.275c-1.084-.479-1.626-.814-1.579-1.308.048-.494.127-.765.398-.701.271.064.91 1.211 3.365 1.737s4.848.447 4.848.447 2.394.08 4.849-.447c2.455-.526 3.093-1.673 3.364-1.737.271-.064.35.207.398.7.048.495-.494.83-1.578 1.309-1.084.478-.51 1.275-.51 1.275s.399.892 1.005 1.403c.605.51 1.498.143 2.805-.367 1.307-.51 2.55-1.357 3.954-2.168 1.405-.811 1.562-1.882 1.594-3.253.032-1.37-.191-5.863-1.148-8.193-.956-2.33-1.546-3.914-2.28-5.269-.732-1.355-1.379-2.176-1.96-2.44-.582-.262-3.827-1.578-4.903-1.578-1.076 0-1.394.75-1.394.75l-.375.829s-2.52-.479-3.804-.48c-1.284 0-3.837.48-3.837.48l-.375-.83s-.318-.749-1.395-.749zm.117 9.948h.04c1.569 0 2.84 1.373 2.84 3.066 0 1.694-1.271 3.066-2.84 3.066s-2.84-1.372-2.84-3.066c-.001-1.677 1.247-3.043 2.8-3.066zm10.907 0h.04c1.553.023 2.8 1.39 2.8 3.066 0 1.694-1.271 3.066-2.84 3.066-1.57 0-2.84-1.372-2.84-3.066 0-1.693 1.27-3.066 2.84-3.066z" />
                  </svg>
                  <p className="label-overline text-brand-orange">Community</p>
                </div>
              </FadeIn>

              <FadeIn>
                <h2 className="editorial-heading text-4xl text-brand-white md:text-5xl lg:text-6xl">
                  Join the
                  <br />
                  NNGTW
                  <br />
                  Community.
                </h2>
              </FadeIn>

              <FadeIn delay={0.15}>
                <p className="mt-10 max-w-md text-base leading-9 text-brand-grey/70">
                  Connect with developers, share your creations, participate in playtests, and stay up to date with everything we&apos;re building.
                </p>
              </FadeIn>

              <FadeIn delay={0.25}>
                <a
                  href={SOCIAL.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-10 inline-flex items-center gap-3 bg-[#5865F2] px-8 py-4 font-display text-sm tracking-widest text-white uppercase transition-all duration-300 hover:bg-[#6B77F5]"
                >
                  <svg className="h-5 w-5" viewBox="0 0 33.867 33.867" fill="currentColor" aria-hidden="true">
                    <path d="M11.343 5.177c-1.076 0-4.32 1.316-4.902 1.579-.582.263-1.228 1.084-1.961 2.439-.734 1.355-1.323 2.939-2.28 5.269-.956 2.33-1.179 6.822-1.147 8.193.032 1.371.189 2.442 1.594 3.253 1.404.81 2.646 1.658 3.953 2.168 1.308.51 2.2.877 2.806.367.606-.51 1.005-1.403 1.005-1.403s.574-.797-.51-1.275c-1.084-.479-1.626-.814-1.579-1.308.048-.494.127-.765.398-.701.271.064.91 1.211 3.365 1.737s4.848.447 4.848.447 2.394.08 4.849-.447c2.455-.526 3.093-1.673 3.364-1.737.271-.064.35.207.398.7.048.495-.494.83-1.578 1.309-1.084.478-.51 1.275-.51 1.275s.399.892 1.005 1.403c.605.51 1.498.143 2.805-.367 1.307-.51 2.55-1.357 3.954-2.168 1.405-.811 1.562-1.882 1.594-3.253.032-1.37-.191-5.863-1.148-8.193-.956-2.33-1.546-3.914-2.28-5.269-.732-1.355-1.379-2.176-1.96-2.44-.582-.262-3.827-1.578-4.903-1.578-1.076 0-1.394.75-1.394.75l-.375.829s-2.52-.479-3.804-.48c-1.284 0-3.837.48-3.837.48l-.375-.83s-.318-.749-1.395-.749zm.117 9.948h.04c1.569 0 2.84 1.373 2.84 3.066 0 1.694-1.271 3.066-2.84 3.066s-2.84-1.372-2.84-3.066c-.001-1.677 1.247-3.043 2.8-3.066zm10.907 0h.04c1.553.023 2.8 1.39 2.8 3.066 0 1.694-1.271 3.066-2.84 3.066-1.57 0-2.84-1.372-2.84-3.066 0-1.693 1.27-3.066 2.84-3.066z" />
                  </svg>
                  Join Discord
                  <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </FadeIn>
            </div>

            {/* Right — feature list */}
            <FadeIn delay={0.2} direction="left" className="lg:col-span-5 lg:col-start-8">
              <div className="space-y-0">
                {[
                  { label: "Development updates", desc: "See what we're working on before anyone else." },
                  { label: "Community events", desc: "Participate in exclusive events and challenges." },
                  { label: "Fan art", desc: "Share your creations and see what others are making." },
                  { label: "Playtests", desc: "Get early access and help shape our games." },
                  { label: "Early announcements", desc: "Be the first to know about new projects." },
                ].map((feature, i) => (
                  <div
                    key={feature.label}
                    className="group flex gap-5 border-b border-brand-white/5 py-7 transition-colors hover:border-brand-white/10"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand-orange/30 text-[10px] font-medium text-brand-orange">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-display text-sm tracking-wide text-brand-white uppercase">
                        {feature.label}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-brand-grey">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function CommCardComponent({ card }: { card: CommCard }) {
  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden border p-7 transition-all duration-500 lg:p-8",
        card.highlight
          ? "border-[#5865F2]/20 bg-[#5865F2]/[0.03] hover:border-[#5865F2]/40 hover:bg-[#5865F2]/[0.05]"
          : "border-brand-white/5 bg-brand-white/[0.02] hover:border-brand-white/10 hover:bg-brand-white/[0.04]"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center border transition-colors duration-300",
          card.highlight
            ? "border-[#5865F2]/20 text-[#5865F2] group-hover:border-[#5865F2]/40"
            : "border-brand-white/10 text-brand-grey/50 group-hover:border-brand-orange/30 group-hover:text-brand-orange"
        )}
      >
        {card.icon}
      </div>

      {/* Title */}
      <h3 className="mt-6 font-display text-lg tracking-wide text-brand-white uppercase">
        {card.title}
      </h3>

      {/* Description */}
      <p className="mt-3 text-sm leading-relaxed text-brand-grey">{card.description}</p>

      {/* Items list */}
      {card.items && card.items.length > 0 && (
        <ul className="mt-5 space-y-2">
          {card.items.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-brand-grey/70">
              <span className="h-px w-3 bg-brand-orange/50" />
              {item}
            </li>
          ))}
        </ul>
      )}

      {/* Actions */}
      {card.actions && card.actions.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-3 pt-7">
          {card.actions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noopener noreferrer" : undefined}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 text-xs tracking-[0.1em] uppercase transition-all duration-300",
                action.primary
                  ? card.highlight
                    ? "bg-[#5865F2] text-white hover:bg-[#6B77F5]"
                    : "bg-brand-orange text-brand-black hover:bg-brand-orange/90"
                  : "border border-brand-white/10 text-brand-grey hover:border-brand-white/20 hover:text-brand-white"
              )}
            >
              {action.label}
              {action.external && (
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function CareersCard() {
  return (
    <div className="group flex h-full flex-col justify-between border border-brand-white/5 bg-brand-white/[0.02] p-7 transition-all duration-500 hover:border-brand-orange/20 hover:bg-brand-white/[0.04] lg:p-8">
      <div>
        <div className="inline-flex h-11 w-11 items-center justify-center border border-brand-white/10 text-brand-grey/50 transition-colors duration-300 group-hover:border-brand-orange/30 group-hover:text-brand-orange">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M20 7h-9M14 17H5" />
            <circle cx="17" cy="17" r="3" />
            <circle cx="7" cy="7" r="3" />
          </svg>
        </div>
        <h3 className="mt-6 font-display text-lg tracking-wide text-brand-white uppercase">
          Want to join NNGTW?
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-brand-grey">
          Explore internships and open positions on our Careers page.
        </p>
      </div>
      <Link
        href="/careers"
        className="mt-6 inline-flex items-center gap-2 text-xs tracking-[0.1em] text-brand-orange uppercase transition-all duration-300 hover:gap-3"
      >
        View Careers
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
