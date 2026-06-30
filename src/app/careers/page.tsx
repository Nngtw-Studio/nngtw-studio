import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { careers, careerStatusLabels } from "@/lib/data/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join NNGTW Studio — game development careers and future opportunities.",
};

const statusStyles: Record<string, string> = {
  open: "border-green-500/30 bg-green-500/10 text-green-400",
  internship: "border-brand-orange/30 bg-brand-orange/10 text-brand-orange",
  future: "border-brand-white/20 bg-brand-white/5 text-brand-grey",
  closed: "border-red-500/20 bg-red-500/5 text-red-400/60",
};

export default function CareersPage() {
  return (
    <>
      <PageHeader
        label="Join Us"
        title="Careers"
        description="We're building a team of passionate creators. Explore current and future opportunities at NNGTW Studio."
      />

      <section className="mx-auto max-w-[1600px] px-6 pb-32 md:px-12 lg:px-20">
        <FadeIn>
          <p className="mb-12 max-w-2xl text-base text-brand-grey">
            Most roles are marked as future opportunities — we&apos;re growing
            thoughtfully. If you share our vision, we&apos;d love to hear from you
            regardless of current openings.
          </p>
        </FadeIn>

        <StaggerContainer className="space-y-4">
          {careers.map((career) => (
            <StaggerItem key={career.id}>
              <Link
                href={`/careers/${career.slug}`}
                className="group flex flex-col gap-4 border border-brand-white/5 p-6 transition-colors hover:border-brand-orange/20 md:flex-row md:items-center md:justify-between md:p-8"
              >
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-lg tracking-wide text-brand-white uppercase transition-colors group-hover:text-brand-orange md:text-xl">
                      {career.title}
                    </h2>
                    <span
                      className={cn(
                        "inline-block border px-2 py-0.5 text-[10px] tracking-[0.15em] uppercase",
                        statusStyles[career.status]
                      )}
                    >
                      {careerStatusLabels[career.status]}
                    </span>
                  </div>
                  <p className="text-sm text-brand-grey">
                    {career.department} · {career.location} · {career.type}
                  </p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-grey">
                    {career.description}
                  </p>
                </div>
                <span className="shrink-0 text-xs tracking-[0.2em] text-brand-grey uppercase transition-colors group-hover:text-brand-orange">
                  View &rarr;
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>
    </>
  );
}
