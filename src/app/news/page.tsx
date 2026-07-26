import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { SOCIAL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "News",
  description:
    "Development logs, game updates, studio news, and technology articles from Nngtw Studio.",
};

const ArrowIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 33.867 33.867" fill="currentColor" aria-hidden="true">
    <path d="M11.343 5.177c-1.076 0-4.32 1.316-4.902 1.579-.582.263-1.228 1.084-1.961 2.439-.734 1.355-1.323 2.939-2.28 5.269-.956 2.33-1.179 6.822-1.147 8.193.032 1.371.189 2.442 1.594 3.253 1.404.81 2.646 1.658 3.953 2.168 1.308.51 2.2.877 2.806.367.606-.51 1.005-1.403 1.005-1.403s.574-.797-.51-1.275c-1.084-.479-1.626-.814-1.579-1.308.048-.494.127-.765.398-.701.271.064.91 1.211 3.365 1.737s4.848.447 4.848.447 2.394.08 4.849-.447c2.455-.526 3.093-1.673 3.364-1.737.271-.064.35.207.398.7.048.495-.494.83-1.578 1.309-1.084.478-.51 1.275-.51 1.275s.399.892 1.005 1.403c.605.51 1.498.143 2.805-.367 1.307-.51 2.55-1.357 3.954-2.168 1.405-.811 1.562-1.882 1.594-3.253.032-1.37-.191-5.863-1.148-8.193-.956-2.33-1.546-3.914-2.28-5.269-.732-1.355-1.379-2.176-1.96-2.44-.582-.262-3.827-1.578-4.903-1.578-1.076 0-1.394.75-1.394.75l-.375.829s-2.52-.479-3.804-.48c-1.284 0-3.837.48-3.837.48l-.375-.83s-.318-.749-1.395-.749zm.117 9.948h.04c1.569 0 2.84 1.373 2.84 3.066 0 1.694-1.271 3.066-2.84 3.066s-2.84-1.372-2.84-3.066c-.001-1.677 1.247-3.043 2.8-3.066zm10.907 0h.04c1.553.023 2.8 1.39 2.8 3.066 0 1.694-1.271 3.066-2.84 3.066-1.57 0-2.84-1.372-2.84-3.066 0-1.693 1.27-3.066 2.84-3.066z" />
  </svg>
);

const TAG_COLOR: Record<string, string> = {
  "Development log": "border-brand-orange/45 text-brand-orange",
  "Game update": "border-brand-orange/45 text-brand-orange",
  "Product log": "border-[#a8b0ff]/45 text-[#a8b0ff]",
  Engineering: "border-[#a8b0ff]/45 text-[#a8b0ff]",
  Technology: "border-brand-secondary/45 text-[#f472b6]",
  Research: "border-brand-secondary/45 text-[#f472b6]",
  Announcement: "border-brand-white/25 text-brand-white/80",
  Hiring: "border-brand-white/25 text-brand-white/80",
};

const tagClass = (tag: string) =>
  cn(
    "inline-block rounded-full border px-2.5 py-1 font-accent text-[9px] tracking-[0.2em] uppercase",
    TAG_COLOR[tag] ?? "border-brand-white/20 text-brand-white/65"
  );

type ArtKind = "games" | "apps" | "xr" | "studio";

const ART_BG: Record<ArtKind, string> = {
  games: "bg-[linear-gradient(150deg,rgba(245,138,31,.2),rgba(36,22,22,0)_70%)] bg-brand-black",
  apps: "bg-[linear-gradient(150deg,rgba(168,176,255,.2),rgba(36,22,22,0)_70%)] bg-[#1b1420]",
  xr: "bg-[linear-gradient(150deg,rgba(223,19,138,.22),rgba(36,22,22,0)_70%)] bg-[#241620]",
  studio: "bg-[linear-gradient(150deg,rgba(242,239,231,.1),rgba(36,22,22,0)_70%)] bg-brand-black",
};

const alsoNew = [
  {
    tag: "Announcement",
    date: "Jul 15",
    title: "Playtest sign-ups open for King Summon",
    excerpt: "First external build goes out to Discord members this month.",
  },
  {
    tag: "Product log",
    date: "Jul 11",
    title: "Portal ships every internal build automatically",
    excerpt: "Push a build, testers get it in minutes, feedback attaches to the version played.",
  },
  {
    tag: "Development log",
    date: "Jul 07",
    title: "Summon queue reworked after playtest feedback",
    excerpt: "Turn order is readable now — players stopped losing to the interface.",
  },
  {
    tag: "Announcement",
    date: "Jul 03",
    title: "Two artists join the team",
    excerpt: "Character and environment work moves in-house from this sprint on.",
  },
];

const xrList = [
  {
    num: "01",
    category: "Research",
    date: "Jun 26, 2026",
    read: "5 min read",
    title: "Hand tracking without a controller fallback",
    excerpt:
      "Pinch, grab, and point carried the whole test build. What broke was confidence, not accuracy — players need to see the hand register before they trust it.",
  },
  {
    num: "02",
    category: "Engineering",
    date: "Apr 08, 2026",
    read: "7 min read",
    title: "The 90fps budget on standalone hardware",
    excerpt:
      "Where the frame time actually goes on a mobile chipset, and the four passes we cut to hold a steady 90 without dropping visual density.",
  },
  {
    num: "03",
    category: "Research",
    date: "Mar 22, 2026",
    read: "5 min read",
    title: "Passthrough as a design material, not a gimmick",
    excerpt:
      "Mixed reality stops being a novelty the moment the room matters to the mechanic. Three prototypes where it did, and one where it did not.",
  },
  {
    num: "04",
    category: "Technology",
    date: "Mar 05, 2026",
    read: "6 min read",
    title: "Why we chose OpenXR over per-platform SDKs",
    excerpt:
      "One integration, several runtimes, and a smaller surface to maintain — plus the tradeoffs we accepted to get there.",
  },
];

const recentFeed: {
  tag: string;
  kind: ArtKind;
  artLabel: string;
  date: string;
  title: string;
  excerpt: string;
}[] = [
  {
    tag: "Game update",
    kind: "games",
    artLabel: "Key art",
    date: "Jun 30, 2026",
    title: "Number Forest gets a full lighting pass",
    excerpt: "The Fibonacci canopy finally reads at a glance — and puzzle sightlines survived the rework.",
  },
  {
    tag: "Development log",
    kind: "games",
    artLabel: "Key art",
    date: "Jun 20, 2026",
    title: "Combat prototype milestone",
    excerpt: "The core summoning and battle loop is playable internally. Feedback is already reshaping pacing.",
  },
  {
    tag: "Development log",
    kind: "games",
    artLabel: "Key art",
    date: "Jun 16, 2026",
    title: "Battle pacing: turn timers and the surrender rule",
    excerpt: "Two small rules cut the average match from nineteen minutes to twelve without losing depth.",
  },
  {
    tag: "Game update",
    kind: "games",
    artLabel: "Key art",
    date: "Jun 10, 2026",
    title: "First realm complete, start to finish",
    excerpt: "Number Forest is our first fully explorable mathematical environment.",
  },
  {
    tag: "Game update",
    kind: "games",
    artLabel: "Key art",
    date: "May 28, 2026",
    title: "Ability tooltips rewritten from scratch",
    excerpt:
      "Players were losing fights to unclear wording, not to bad decisions. Every tooltip now states its numbers plainly.",
  },
  {
    tag: "Product log",
    kind: "apps",
    artLabel: "Product artwork",
    date: "May 21, 2026",
    title: "Nngtw Portal enters internal beta",
    excerpt: "Build distribution and playtest feedback in one place, dogfooded daily.",
  },
  {
    tag: "Technology",
    kind: "xr",
    artLabel: "Capture artwork",
    date: "May 15, 2026",
    title: "OpenXR integration research",
    excerpt: "Evaluating cross-platform XR across Unity and Unreal.",
  },
  {
    tag: "Research",
    kind: "xr",
    artLabel: "Capture artwork",
    date: "Apr 30, 2026",
    title: "What room-scale means for a strategy game",
    excerpt: "Notes from three failed prototypes, and the one spatial control scheme that stuck.",
  },
  {
    tag: "Engineering",
    kind: "apps",
    artLabel: "Product artwork",
    date: "Apr 24, 2026",
    title: "Puzzle authoring tool cuts build time in half",
    excerpt: "Designers now assemble a realm end to end without an engineer in the loop.",
  },
];

const recentCards = recentFeed.slice(0, 3);
const recentRows = recentFeed.slice(3);

const studioAnnouncements = [
  {
    date: "May 28, 2026",
    title: "Discord community now open",
    excerpt: "Dev logs, build notes, and playtest invitations, first.",
  },
  {
    date: "Apr 11, 2026",
    title: "Welcome to Nngtw Studio",
    excerpt: "An independent team building original games with a vision for immersive futures.",
  },
];

const studioHiring = [
  {
    date: "Jul 08, 2026",
    title: "Opening an XR developer search",
    excerpt: "OpenXR experience, spatial design instincts, remote.",
  },
  {
    date: "Jun 05, 2026",
    title: "What we look for in a technical artist",
    excerpt: "How our art and engineering tracks actually meet in practice.",
  },
];

const studioCompany = [
  {
    date: "Jul 01, 2026",
    title: "Half-year review, published in full",
    excerpt: "What shipped, what slipped, and what we cut in the first half of 2026.",
  },
  {
    date: "May 09, 2026",
    title: "How we decide what to build next",
    excerpt: "The one-page test every project has to pass before it gets a team.",
  },
];

function HeroSection() {
  return (
    <section data-hero className="relative overflow-hidden bg-brand-black pt-36 pb-16 md:pt-44 md:pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_12%_0%,rgba(245,138,31,.13),transparent_62%),radial-gradient(ellipse_55%_60%_at_92%_20%,rgba(223,19,138,.1),transparent_66%),radial-gradient(ellipse_50%_40%_at_60%_100%,rgba(88,101,242,.07),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent"
      />

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20 xl:px-28">
        <FadeIn>
          <div className="mb-6 flex flex-wrap items-center gap-3.5">
            <span className="accent-line" />
            <span className="label-overline text-brand-orange">Development Log</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              <span className="font-accent text-[9px] tracking-[0.24em] text-green-300 uppercase">
                Updated July 18
              </span>
            </span>
          </div>

          <div className="mb-12 grid gap-10 md:grid-cols-12 md:items-end lg:gap-14">
            <h1 className="editorial-heading text-5xl text-brand-white sm:text-6xl md:col-span-7 md:text-7xl lg:text-8xl">
              Straight from
              <br />
              the build<span className="text-brand-secondary">.</span>
            </h1>
            <p className="max-w-[44ch] text-base leading-8 text-brand-white/68 md:col-span-5 md:text-lg">
              Games, applications, and immersive work &mdash; written up as it happens. Newest first, always.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
            <Link
              href="/news"
              className="cursor-target group relative flex min-h-[520px] flex-col justify-end overflow-hidden rounded-3xl border border-brand-orange/28 bg-[#241616] shadow-[0_40px_90px_-45px_rgba(0,0,0,.85)] transition-all duration-350 hover:-translate-y-1 hover:border-brand-orange/70 lg:col-span-7"
            >
              <img
                src="/banners/king-summon.svg"
                alt="King Summon key art"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#180d0d] from-[6%] via-[#180d0d]/70 via-40% to-[#180d0d]/15 to-80%"
              />
              <span className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full border border-brand-orange/55 bg-brand-black/72 px-3.5 py-2 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                <span className="font-accent text-[9px] tracking-[0.24em] text-brand-orange uppercase">
                  Latest update
                </span>
              </span>
              <div className="relative p-8 md:p-12">
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span className={tagClass("Development log")}>Development log</span>
                  <span className="rounded-full border border-brand-white/20 px-3 py-1.5 font-accent text-[9px] tracking-[0.2em] text-brand-white/65 uppercase">
                    Games
                  </span>
                  <time className="font-accent text-[9px] tracking-[0.2em] text-brand-white/60 uppercase">
                    July 18, 2026 &middot; King Summon
                  </time>
                </div>
                <h2 className="max-w-[26ch] font-display text-[clamp(2rem,3.4vw,3rem)] leading-[0.94] font-black tracking-tight text-brand-white">
                  Creature roster hits twelve, each with a full ability kit
                </h2>
                <p className="mt-4.5 max-w-[56ch] text-base leading-8 text-brand-white/74">
                  The roster is finally deep enough to test real counterplay &mdash; twelve creatures across three
                  combat roles, and the first synergies that genuinely surprised us in playtest.
                </p>
                <span className="mt-7 inline-flex h-13 items-center justify-center gap-2.5 rounded-xl bg-brand-orange-dark px-7 font-secondary text-[15px] font-semibold text-brand-white transition-colors group-hover:bg-brand-orange group-hover:text-brand-black">
                  Read more <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </Link>

            <div className="flex flex-col rounded-3xl border border-brand-white/10 bg-[#241616] lg:col-span-5">
              <div className="flex items-center justify-between gap-4 border-b border-brand-white/8 px-7 py-6.5">
                <span className="font-accent text-[10px] font-semibold tracking-[0.28em] text-brand-white/55 uppercase">
                  Also new
                </span>
                <a
                  href="#recent"
                  className="cursor-target font-accent text-[9px] tracking-[0.24em] text-brand-orange/90 uppercase"
                >
                  All recent &rarr;
                </a>
              </div>
              {alsoNew.map((n) => (
                <Link
                  key={n.title}
                  href="/news"
                  className="cursor-target flex flex-1 flex-col justify-center gap-2 border-b border-brand-white/6 px-7 py-6 transition-colors last:border-b-0 hover:bg-brand-white/3"
                >
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className={tagClass(n.tag)}>{n.tag}</span>
                    <time className="font-accent text-[9px] tracking-[0.16em] text-brand-white/40 uppercase">
                      {n.date}
                    </time>
                  </div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-brand-white">{n.title}</h3>
                  <p className="text-[13px] leading-6.5 text-brand-white/50">{n.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-7 rounded-2xl border border-brand-white/9 bg-brand-white/2 px-6.5 py-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="mr-1.5 font-accent text-[9px] tracking-[0.26em] text-brand-white/40 uppercase">
                Jump to
              </span>
              <a
                href="#xr"
                className="cursor-target rounded-full border border-brand-secondary/40 px-4 py-2 font-accent text-[10px] tracking-[0.2em] text-[#f472b6] uppercase transition-colors hover:bg-brand-secondary/14"
              >
                XR &middot; 5
              </a>
              <a
                href="#recent"
                className="cursor-target rounded-full border border-brand-white/16 px-4 py-2 font-accent text-[10px] tracking-[0.2em] text-brand-white/75 uppercase transition-colors hover:border-brand-white hover:bg-brand-white hover:text-brand-black"
              >
                Recent &middot; 9
              </a>
              <a
                href="#studio"
                className="cursor-target rounded-full border border-brand-white/16 px-4 py-2 font-accent text-[10px] tracking-[0.2em] text-brand-white/75 uppercase transition-colors hover:bg-brand-white/10"
              >
                Studio &middot; 7
              </a>
            </div>
            <div className="flex items-center gap-6.5">
              <div className="flex items-baseline gap-2.5">
                <span className="font-display text-2xl font-black tracking-tight text-brand-white">21</span>
                <span className="font-accent text-[9px] tracking-[0.22em] text-brand-white/45 uppercase">
                  In these sections
                </span>
              </div>
              <span className="h-5 w-px bg-brand-white/12" />
              <div className="flex items-baseline gap-2.5">
                <span className="font-display text-2xl font-black tracking-tight text-brand-white">4</span>
                <span className="font-accent text-[9px] tracking-[0.22em] text-brand-white/45 uppercase">
                  Projects in build
                </span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function XrSection() {
  return (
    <section
      id="xr"
      className="relative scroll-mt-20 overflow-hidden border-t border-brand-white/6 bg-[#1b1016]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand-secondary to-brand-secondary/0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_82%_25%,rgba(223,19,138,.12),transparent_66%)]"
      />
      <div className="relative mx-auto max-w-[1600px] px-6 py-26 md:px-12 lg:px-20 xl:px-28">
        <FadeIn>
          <div className="mb-11 flex flex-wrap items-end justify-between gap-10">
            <div>
              <div className="mb-4.5 flex items-center gap-3.5">
                <span className="h-px w-9 bg-brand-secondary" />
                <span className="label-overline text-[#f472b6]">XR</span>
              </div>
              <h2 className="editorial-heading text-[clamp(2.25rem,3.8vw,3.5rem)] text-brand-white">
                Notes from the headset.
              </h2>
              <p className="mt-4 max-w-[56ch] text-base leading-8 text-brand-white/60">
                Everything we learn building for immersive hardware &mdash; runtimes, input, and the ideas that
                didn&rsquo;t survive contact with a headset.
              </p>
            </div>
            <Link
              href="/technology"
              className="cursor-target inline-flex h-11 items-center gap-2.5 rounded-xl border border-brand-white/14 px-5 font-secondary text-[13px] text-brand-white/75 transition-colors hover:border-brand-white hover:bg-brand-white hover:text-brand-black"
            >
              Our XR stack <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <Link
            href="/news"
            className="cursor-target group relative mb-13 flex min-h-[520px] flex-col justify-end overflow-hidden rounded-3xl border border-brand-secondary/26 bg-[linear-gradient(135deg,rgba(223,19,138,.22),rgba(27,16,22,.2)_55%)] p-5 shadow-[0_40px_90px_-45px_rgba(0,0,0,.85)] transition-all duration-350 hover:-translate-y-1 hover:border-brand-secondary/70 md:p-10"
            style={{ backgroundColor: "#241620" }}
          >
            <span
              aria-hidden="true"
              className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-accent text-[11px] tracking-[0.34em] text-brand-white/20 uppercase"
            >
              Immersive capture artwork
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#140b10] from-[4%] via-[#140b10]/35 via-46% to-transparent to-80%"
            />
            <span className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full border border-brand-secondary/55 bg-[#1b1016]/70 px-3.5 py-2 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary" />
              <span className="font-accent text-[9px] tracking-[0.24em] text-[#f472b6] uppercase">
                Featured update
              </span>
            </span>
            <div className="relative mt-[200px] flex flex-wrap items-end justify-between gap-10 rounded-[20px] border border-brand-secondary/28 bg-[#180d12]/86 p-6 backdrop-blur-md md:p-9">
              <div>
                <div className="mb-4.5 flex flex-wrap items-center gap-3">
                  <span className={tagClass("Technology")}>Technology</span>
                  <time className="font-accent text-[9px] tracking-[0.2em] text-brand-white/55 uppercase">
                    July 09, 2026
                  </time>
                  <span className="text-brand-white/22">&middot;</span>
                  <span className="font-accent text-[9px] tracking-[0.2em] text-brand-white/55 uppercase">
                    4 min read
                  </span>
                </div>
                <h3 className="max-w-[26ch] font-display text-[clamp(2rem,3.4vw,3rem)] leading-[0.94] font-black tracking-tight text-brand-white">
                  One build, two headsets: the OpenXR sandbox runs
                </h3>
                <p className="mt-4.5 max-w-[58ch] text-base leading-8 text-brand-white/70">
                  A single codebase now targets two runtimes with no per-platform forks. Hand tracking and
                  room-scale locomotion are next on the bench.
                </p>
              </div>
              <span className="inline-flex h-13 shrink-0 items-center justify-center gap-2.5 rounded-xl border border-brand-secondary/80 bg-brand-secondary/18 px-7 font-secondary text-[15px] font-semibold whitespace-nowrap text-brand-white">
                Read more <span aria-hidden="true">&rarr;</span>
              </span>
            </div>
          </Link>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-7">
            <div className="flex flex-wrap items-baseline gap-4">
              <h3 className="font-display text-[22px] font-extrabold tracking-tight text-brand-white">
                More from the XR track
              </h3>
              <span className="font-accent text-[10px] tracking-[0.22em] text-brand-white/40 uppercase">
                Research &amp; engineering notes
              </span>
            </div>
            <Link
              href="/news"
              className="cursor-target inline-flex h-10 items-center gap-2.5 rounded-full border border-brand-secondary/40 py-0 pr-2 pl-4.5 font-accent text-[10px] tracking-[0.22em] text-[#f472b6] uppercase transition-colors hover:border-brand-secondary hover:bg-brand-secondary/14"
            >
              View all
              <span
                aria-hidden="true"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-secondary/22"
              >
                <ArrowIcon className="h-3 w-3" />
              </span>
            </Link>
          </div>
        </FadeIn>

        <StaggerContainer className="overflow-hidden rounded-[22px] border border-brand-white/9 bg-brand-white/2">
          {xrList.map((c) => (
            <StaggerItem key={c.num}>
              <Link
                href="/news"
                className="cursor-target group flex flex-wrap items-center gap-4 border-t border-brand-white/7 px-4.5 py-6.5 transition-colors first:border-t-0 hover:bg-brand-secondary/6 md:gap-8 md:px-8"
              >
                <span className="shrink-0 font-accent text-[11px] tracking-[0.24em] text-[#f472b6]/70">
                  {c.num}
                </span>
                <div
                  className={cn(
                    "flex h-[100px] min-w-34 flex-1 items-center justify-center overflow-hidden rounded-[14px] border border-brand-secondary/18 md:h-[124px] md:flex-none md:basis-50",
                    ART_BG.xr
                  )}
                >
                  <span className="font-accent text-[8px] tracking-[0.26em] text-brand-white/30 uppercase">
                    Capture artwork
                  </span>
                </div>
                <div className="flex min-w-0 flex-[999_1_260px] flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={tagClass(c.category)}>{c.category}</span>
                    <time className="font-accent text-[9px] tracking-[0.16em] text-brand-white/42 uppercase">
                      {c.date}
                    </time>
                    <span className="text-brand-white/20">&middot;</span>
                    <span className="font-accent text-[9px] tracking-[0.16em] text-brand-white/42 uppercase">
                      {c.read}
                    </span>
                  </div>
                  <h4 className="max-w-[38ch] font-display text-[clamp(1.25rem,1.8vw,1.5rem)] leading-tight font-bold tracking-tight text-brand-white">
                    {c.title}
                  </h4>
                  <p className="max-w-[70ch] text-sm leading-7 text-brand-white/52">{c.excerpt}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-white/16 text-brand-white/65 transition-colors group-hover:border-brand-secondary group-hover:bg-brand-secondary/16 group-hover:text-brand-white md:h-13 md:w-13"
                >
                  <ArrowIcon className="h-3.5 w-3.5" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function RecentSection() {
  const filters = ["All", "Development log", "Game update", "Technology", "Announcement"];
  return (
    <section id="recent" className="relative scroll-mt-20 overflow-hidden border-t border-brand-white/6 bg-brand-black">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-45 -right-35 h-130 w-130 rounded-full bg-brand-orange/5 blur-[160px]"
      />
      <div className="relative mx-auto max-w-[1600px] px-6 py-26 md:px-12 lg:px-20 xl:px-28">
        <FadeIn>
          <div className="mb-11 flex flex-wrap items-end justify-between gap-10">
            <div>
              <div className="mb-4.5 flex items-center gap-3.5">
                <span className="accent-line" />
                <span className="label-overline text-brand-orange">Recent</span>
              </div>
              <h2 className="editorial-heading text-[clamp(2.25rem,3.8vw,3.5rem)] text-brand-white">
                What we&rsquo;ve shipped lately.
              </h2>
            </div>
            <div className="flex max-w-[520px] flex-wrap justify-end gap-2">
              {filters.map((f) => (
                <span
                  key={f}
                  className={cn(
                    "rounded-full border px-4.5 py-2.5 font-accent text-[10px] tracking-[0.2em] uppercase",
                    f === "All"
                      ? "border-brand-white bg-brand-white text-brand-black"
                      : "border-brand-white/14 text-brand-white/55"
                  )}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>

        <StaggerContainer className="mb-5 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          {recentCards.map((c) => (
            <StaggerItem key={c.title}>
              <Link
                href="/news"
                className="cursor-target group flex h-full flex-col overflow-hidden rounded-[20px] border border-brand-white/9 bg-[#241616] transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/50"
              >
                <div className={cn("flex h-40 items-center justify-center border-b border-brand-white/7", ART_BG[c.kind])}>
                  <span className="font-accent text-[8px] tracking-[0.26em] text-brand-white/30 uppercase">
                    {c.artLabel}
                  </span>
                </div>
                <div className="flex flex-col gap-3.5 p-6.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className={tagClass(c.tag)}>{c.tag}</span>
                    <time className="font-accent text-[9px] tracking-[0.16em] text-brand-white/42 uppercase">
                      {c.date}
                    </time>
                  </div>
                  <h3 className="font-display text-xl leading-tight font-bold tracking-tight text-brand-white">
                    {c.title}
                  </h3>
                  <p className="text-sm leading-7 text-brand-white/52">{c.excerpt}</p>
                  <span className="mt-1 inline-flex items-center gap-2 font-accent text-[9px] tracking-[0.26em] text-brand-orange/85 uppercase">
                    Read more <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <StaggerContainer className="overflow-hidden rounded-[20px] border border-brand-white/9 bg-brand-white/2">
          {recentRows.map((r) => (
            <StaggerItem key={r.title}>
              <Link
                href="/news"
                className="cursor-target grid grid-cols-1 gap-3 border-t border-brand-white/6 px-6.5 py-6 transition-colors first:border-t-0 hover:bg-brand-white/3 sm:grid-cols-[110px_minmax(0,1fr)_auto] sm:items-center sm:gap-8"
              >
                <time className="font-accent text-[10px] tracking-[0.16em] text-brand-white/45 uppercase">
                  {r.date}
                </time>
                <div>
                  <h3 className="font-display text-lg leading-tight font-semibold tracking-tight text-brand-white">
                    {r.title}
                  </h3>
                  <p className="mt-1.5 max-w-[64ch] text-[13px] leading-7 text-brand-white/48">{r.excerpt}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className={tagClass(r.tag)}>{r.tag}</span>
                  <span aria-hidden="true" className="hidden text-brand-white/30 sm:inline">
                    &rarr;
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="mt-10 text-center">
          <a
            href="#recent"
            className="cursor-target inline-flex h-13 items-center justify-center rounded-xl border border-brand-white/18 px-7.5 font-secondary text-[15px] font-semibold text-brand-white/85 transition-all hover:border-brand-white/50 hover:bg-brand-white/6"
          >
            Load older updates
          </a>
        </div>
      </div>
    </section>
  );
}

function StudioColumn({
  title,
  accentClass,
  items,
  href,
}: {
  title: string;
  accentClass: string;
  items: { date: string; title: string; excerpt: string }[];
  href: string;
}) {
  return (
    <div className="bg-brand-black p-8">
      <h3 className={cn("mb-6 font-accent text-[10px] font-semibold tracking-[0.28em] uppercase", accentClass)}>
        {title}
      </h3>
      {items.map((s) => (
        <Link
          key={s.title}
          href={href}
          className="cursor-target block border-t border-brand-white/7 py-4.5 first:border-t-0"
        >
          <time className="font-accent text-[9px] tracking-[0.16em] text-brand-white/40 uppercase">{s.date}</time>
          <h4 className="mt-2 font-display text-[17px] leading-tight font-semibold tracking-tight text-brand-white">
            {s.title}
          </h4>
          <p className="mt-1.5 text-[13px] leading-7 text-brand-white/50">{s.excerpt}</p>
        </Link>
      ))}
    </div>
  );
}

function StudioSection() {
  return (
    <section id="studio" className="relative scroll-mt-20 overflow-hidden border-t border-brand-white/6 bg-[#170d0d]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand-white/60 to-brand-white/0"
      />
      <div className="relative mx-auto max-w-[1600px] px-6 py-26 md:px-12 lg:px-20 xl:px-28">
        <FadeIn>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
            <div>
              <div className="mb-4.5 flex items-center gap-3.5">
                <span className="h-px w-9 bg-brand-white/60" />
                <span className="label-overline text-brand-white/75">Studio</span>
              </div>
              <h2 className="editorial-heading text-[clamp(2.25rem,3.8vw,3.5rem)] text-brand-white">
                The studio itself.
              </h2>
            </div>
            <Link
              href="/studio"
              className="cursor-target inline-flex h-11 items-center gap-2.5 rounded-xl border border-brand-white/14 px-5 font-secondary text-[13px] text-brand-white/75 transition-colors hover:border-brand-white hover:bg-brand-white hover:text-brand-black"
            >
              About Nngtw <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <Link
            href="/news"
            className="group mb-9 grid gap-10 rounded-3xl border border-brand-white/12 bg-brand-black p-9 transition-all duration-350 hover:-translate-y-1 hover:border-brand-white/35 md:p-13 lg:grid-cols-12 lg:items-end lg:gap-14"
          >
            <div className="lg:col-span-7">
              <div className="mb-5.5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-white/25 bg-brand-white/6 px-3.5 py-1.75 font-accent text-[9px] tracking-[0.22em] text-brand-white/80 uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-white" />
                  Announcement
                </span>
                <time className="font-accent text-[9px] tracking-[0.2em] text-brand-white/50 uppercase">
                  June 12, 2026
                </time>
              </div>
              <h3 className="max-w-[26ch] font-display text-[clamp(2rem,3.2vw,2.875rem)] leading-[0.94] font-black tracking-tight text-brand-white">
                The studio moves to a four-project pipeline
              </h3>
              <p className="mt-5 max-w-[56ch] text-base leading-8 text-brand-white/66">
                Two games, one application, and one XR research track &mdash; each with a named owner and a fixed
                monthly review. Here&rsquo;s how we decided what to run in parallel, and what we deliberately said
                no to.
              </p>
            </div>
            <span className="inline-flex h-13 items-center justify-center gap-2.5 justify-self-start rounded-xl border border-brand-white/28 px-7 font-secondary text-[15px] font-semibold whitespace-nowrap text-brand-white lg:col-span-5 lg:justify-self-end">
              Read more <span aria-hidden="true">&rarr;</span>
            </span>
          </Link>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid gap-px overflow-hidden rounded-[20px] border border-brand-white/8 bg-brand-white/8 md:grid-cols-3">
            <StudioColumn title="Announcements" accentClass="text-brand-orange" items={studioAnnouncements} href="/news" />
            <StudioColumn title="Hiring" accentClass="text-brand-secondary" items={studioHiring} href="/careers" />
            <StudioColumn title="Company news" accentClass="text-brand-white/60" items={studioCompany} href="/news" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function DiscordBand() {
  return (
    <section className="relative overflow-hidden border-t border-brand-white/6 bg-brand-black">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-40%] left-1/2 h-[620px] w-[1000px] -translate-x-1/2 rounded-full bg-[#5865F2]/10 blur-[200px]"
      />
      <FadeIn>
        <div className="relative mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-12 px-6 py-24 md:px-12 lg:px-20 xl:px-28">
          <div>
            <h2 className="editorial-heading max-w-[30ch] text-[clamp(2rem,3.4vw,3rem)] text-brand-white">
              Updates land on Discord first.
            </h2>
            <p className="mt-4.5 max-w-[52ch] text-base leading-8 text-brand-white/62">
              Build notes, playtest invites, and the rough drafts of everything on this page &mdash; days before
              it&rsquo;s written up here.
            </p>
          </div>
          <a
            href={SOCIAL.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-target inline-flex h-15 items-center justify-center gap-3 rounded-2xl bg-[#5865F2] px-8.5 font-secondary text-[17px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#4752c4] hover:shadow-[0_16px_40px_-16px_rgba(88,101,242,.85)]"
          >
            <DiscordIcon className="h-5 w-5" />
            Join Discord
          </a>
        </div>
      </FadeIn>
    </section>
  );
}

export default function NewsPage() {
  return (
    <>
      <HeroSection />
      <XrSection />
      <RecentSection />
      <StudioSection />
      <DiscordBand />
    </>
  );
}
