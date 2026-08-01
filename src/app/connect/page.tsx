import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/sections/ContactForm";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { BRAND, SOCIAL } from "@/lib/constants";

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
      <section data-hero className="relative overflow-hidden pt-36 pb-16 md:pt-44">
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
                Drop a signal straight to the studio. Whatever you need, we&apos;ll make sure it lands on exactly the right desk.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          GET IN TOUCH — community + message form
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative">
        {/* Fading Glass Separator */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-t-[48px]">
          <div 
            className="absolute inset-0 border-t border-x border-brand-white/10 bg-brand-white/[0.02] backdrop-blur-2xl"
            style={{
              maskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0) 400px, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0) 400px, rgba(0,0,0,0) 100%)'
            }}
          />
          {/* Glowing Top Edge Highlight */}
          <div
            className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand-secondary/60 to-transparent shadow-[0_0_16px_rgba(223,19,138,0.5)]"
            aria-hidden="true"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 50% 45% at 5% 15%, rgba(245,138,31,0.05), transparent 65%), radial-gradient(ellipse 50% 50% at 95% 85%, rgba(223,19,138,0.04), transparent 68%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1600px] px-6 pt-16 pb-16 md:px-12 md:pt-20 md:pb-24 lg:px-20 lg:pt-20 xl:px-28">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16 xl:gap-24">
            <div className="lg:col-span-5">
              <FadeIn>
                <p className="label-overline text-brand-grey/50">Reach us</p>
                <h2 className="editorial-heading mt-6 text-4xl text-brand-white md:text-5xl">
                  Let&apos;s get
                  <br />
                  in touch.
                </h2>
                <p className="mt-7 max-w-md text-base leading-8 text-brand-grey/70">
                  Tell us what it&apos;s about in the form and we&apos;ll route it to the
                  right person — no need to guess an inbox. Keep it short and specific and
                  the reply comes faster.
                </p>
              </FadeIn>

              <FadeIn delay={0.1}>
                <dl className="mt-10 max-w-md space-y-0 border-t border-brand-white/8">
                  {[
                    { term: "Typical reply", detail: "Within 2 business days" },
                    { term: "Faster answers", detail: "Ask in Discord — the team is there daily" },
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

              <FadeIn delay={0.2} className="mt-12">
                <SocialCard />
              </FadeIn>
            </div>

            <FadeIn delay={0.15} direction="left" className="lg:col-span-7">
              <div className="flex h-full flex-col justify-between rounded-3xl border border-brand-white/8 bg-brand-white/[0.02] p-7 md:p-10">
                <ContactForm />
              </div>
            </FadeIn>

            <FadeIn delay={0.25} className="lg:col-span-12">
              <DiscordCardBento />
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

function SocialCard() {
  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-brand-white/8 bg-brand-white/[0.02] p-7">
      <div>
        <p className="text-xs tracking-[0.2em] text-brand-grey uppercase">Follow the studio</p>
        <p className="mt-3 text-sm leading-relaxed text-brand-grey">
          Announcements and behind-the-scenes from the team.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-2.5">
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
            className="cursor-target group flex items-center gap-3 rounded-2xl border border-brand-white/8 bg-brand-white/[0.02] p-3 transition-colors duration-300 hover:border-(--accent-soft) hover:bg-brand-white/[0.05]"
          >
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-brand-white/10 text-brand-grey/60 transition-colors duration-300 group-hover:border-(--accent-soft) group-hover:text-(--accent)">
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

function DiscordCardBento() {
  const features = [
    "Latest development updates",
    "Early playtests & previews",
    "Community discussions",
    "Share feedback & ideas",
    "Behind-the-scenes progress",
    "Talk with the Nngtw team"
  ];

  return (
    <a
      href={SOCIAL.discord}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-[28px] border border-[#5865F2]/25 bg-[#5865F2]/[0.06] backdrop-blur-[2px] p-8 transition-all duration-500 ease-out hover:border-[#5865F2]/50 hover:bg-[#5865F2]/[0.09] md:p-12 lg:flex-row lg:items-center lg:gap-6 lg:p-16"
    >
      {/* Sweeping Shine Effect */}
      <div 
        className="pointer-events-none absolute inset-0 z-20 w-1/2 -translate-x-[150%] skew-x-[-25deg] bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-[250%]" 
        aria-hidden="true" 
      />

      {/* Glow Blobs & Ambient Balance */}
      <div
        className="pointer-events-none absolute -top-32 -right-20 z-0 h-[400px] w-[400px] rounded-full bg-[#5865F2]/10 blur-[120px] transition-all duration-700 group-hover:bg-[#5865F2]/15 group-hover:blur-[140px]"
        aria-hidden="true"
      />
      {/* Subtle secondary pink bloom to balance upper right / center */}
      <div
        className="pointer-events-none absolute top-10 right-1/4 z-0 h-[500px] w-[500px] animate-sway rounded-full bg-brand-secondary/[0.06] blur-[150px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 z-0 h-64 w-64 rounded-full bg-[#5865F2]/[0.07] blur-[110px] transition-all duration-700 group-hover:bg-[#5865F2]/10"
        aria-hidden="true"
      />

      {/* Large Background Logo */}
      <DiscordIcon className="pointer-events-none absolute -right-10 -bottom-24 z-0 h-[340px] w-[340px] text-[#5865F2]/[0.08] transition-all duration-700 group-hover:scale-105 group-hover:text-[#5865F2]/[0.12] group-hover:drop-shadow-[0_0_20px_rgba(88,101,242,0.3)]" />

      {/* Left Content */}
      <div className="relative z-10 flex flex-col lg:w-[55%]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <span className="inline-flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-brand-white/10 bg-brand-secondary/5 text-[#5865F2] transition-colors duration-300 group-hover:border-brand-white/20">
            <DiscordIcon className="h-12 w-12 transition-all duration-300 group-hover:h-14 group-hover:w-14" />
          </span>
          <h3 className="editorial-heading whitespace-pre-line text-3xl text-brand-white md:text-4xl lg:text-5xl">
            {`Our community lives\non Discord.`}
          </h3>
        </div>
        <p className="mt-6 font-secondary font-normal tracking-[0.02em] whitespace-pre-line text-[16px] leading-normal text-brand-white/60">
          {`Stay connected with Nngtw. Follow development, discover upcoming projects, share feedback, and connect with the people building them.`}
        </p>

        <div className="mt-6 flex items-center font-secondary text-[18px] font-semibold text-[#5865F2] md:mt-8">
          <span className="tracking-[0.01em] transition-[letter-spacing] duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] group-hover:tracking-[0.1em]">
            Join the community
          </span>
          <span className="ml-2.5 inline-flex origin-left pt-0.75 transition-transform group-hover:animate-jello-vertical">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="45"
              height="18"
              viewBox="0 0 38 15"
              fill="none"
            >
              <path
                fill="currentColor"
                d="M10 7.519l-.939-.344h0l.939.344zm14.386-1.205l-.981-.192.981.192zm1.276 5.509l.537.843.148-.094.107-.139-.792-.611zm4.819-4.304l-.385-.923h0l.385.923zm7.227.707a1 1 0 0 0 0-1.414L31.343.448a1 1 0 0 0-1.414 0 1 1 0 0 0 0 1.414l5.657 5.657-5.657 5.657a1 1 0 0 0 1.414 1.414l6.364-6.364zM1 7.519l.554.833.029-.019.094-.061.361-.23 1.277-.77c1.054-.609 2.397-1.32 3.629-1.787.617-.234 1.17-.392 1.623-.455.477-.066.707-.008.788.034.025.013.031.021.039.034a.56.56 0 0 1 .058.235c.029.327-.047.906-.39 1.842l1.878.689c.383-1.044.571-1.949.505-2.705-.072-.815-.45-1.493-1.16-1.865-.627-.329-1.358-.332-1.993-.244-.659.092-1.367.305-2.056.566-1.381.523-2.833 1.297-3.921 1.925l-1.341.808-.385.245-.104.068-.028.018c-.011.007-.011.007.543.84zm8.061-.344c-.198.54-.328 1.038-.36 1.484-.032.441.024.94.325 1.364.319.45.786.64 1.21.697.403.054.824-.001 1.21-.09.775-.179 1.694-.566 2.633-1.014l3.023-1.554c2.115-1.122 4.107-2.168 5.476-2.524.329-.086.573-.117.742-.115s.195.038.161.014c-.15-.105.085-.139-.076.685l1.963.384c.192-.98.152-2.083-.74-2.707-.405-.283-.868-.37-1.28-.376s-.849.069-1.274.179c-1.65.43-3.888 1.621-5.909 2.693l-2.948 1.517c-.92.439-1.673.743-2.221.87-.276.064-.429.065-.492.057-.043-.006.066.003.155.127.07.099.024.131.038-.063.014-.187.078-.49.243-.94l-1.878-.689zm14.343-1.053c-.361 1.844-.474 3.185-.413 4.161.059.95.294 1.72.811 2.215.567.544 1.242.546 1.664.459a2.34 2.34 0 0 0 .502-.167l.15-.076.049-.028.018-.011c.013-.008.013-.008-.524-.852l-.536-.844.019-.012c-.038.018-.064.027-.084.032-.037.008.053-.013.125.056.021.02-.151-.135-.198-.895-.046-.734.034-1.887.38-3.652l-1.963-.384zm2.257 5.701l.791.611.024-.031.08-.101.311-.377 1.093-1.213c.922-.954 2.005-1.894 2.904-2.27l-.771-1.846c-1.31.547-2.637 1.758-3.572 2.725l-1.184 1.314-.341.414-.093.117-.025.032c-.01.013-.01.013.781.624zm5.204-3.381c.989-.413 1.791-.42 2.697-.307.871.108 2.083.385 3.437.385v-2c-1.197 0-2.041-.226-3.19-.369-1.114-.139-2.297-.146-3.715.447l.771 1.846z"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Right Content: Feature List */}
      <div className="relative z-10 mt-12 shrink-0 lg:mt-0 lg:flex-1">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
                <svg viewBox="0 0 14 14" fill="none" className="h-3 w-3">
                  <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="font-secondary font-normal tracking-[0.02em] text-[14px] text-brand-white/60">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </a>
  );
}
