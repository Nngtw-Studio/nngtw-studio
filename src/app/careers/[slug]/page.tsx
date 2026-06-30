import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { careerStatusLabels } from "@/lib/data/content";
import { getAllCareers, getCareerBySlug } from "@/lib/supabase/queries/careers";
import { cn } from "@/lib/utils";

export const revalidate = 3600;
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const careers = await getAllCareers();
  return careers.map((career) => ({ slug: career.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const career = await getCareerBySlug(slug);
  if (!career) return { title: "Role Not Found" };
  return {
    title: career.title,
    description: career.description,
  };
}

const statusStyles: Record<string, string> = {
  open: "border-green-500/30 bg-green-500/10 text-green-400",
  internship: "border-brand-orange/30 bg-brand-orange/10 text-brand-orange",
  future: "border-brand-white/20 bg-brand-white/5 text-brand-grey",
  closed: "border-red-500/20 bg-red-500/5 text-red-400/60",
};

export default async function CareerDetailPage({ params }: Props) {
  const { slug } = await params;
  const career = await getCareerBySlug(slug);
  if (!career) notFound();

  return (
    <>
      <PageHeader
        label={careerStatusLabels[career.status]}
        title={career.title}
        description={`${career.department} · ${career.location} · ${career.type}`}
      />

      <section className="mx-auto max-w-3xl px-6 pb-32 md:px-12">
        <FadeIn>
          <span
            className={cn(
              "inline-block border px-3 py-1 text-[10px] tracking-[0.15em] uppercase",
              statusStyles[career.status]
            )}
          >
            {careerStatusLabels[career.status]}
          </span>

          <h2 className="mt-12 font-display text-xl tracking-wide text-brand-white uppercase">
            About This Role
          </h2>
          <p className="mt-6 text-base leading-relaxed text-brand-grey">
            {career.description}
          </p>

          <h2 className="mt-12 font-display text-xl tracking-wide text-brand-white uppercase">
            Requirements
          </h2>
          <ul className="mt-6 space-y-3">
            {career.requirements.map((req) => (
              <li key={req} className="flex items-start gap-4 text-sm text-brand-grey">
                <span className="mt-2 h-px w-4 shrink-0 bg-brand-orange" />
                {req}
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            {career.status === "open" || career.status === "internship" ? (
              <Button href="/contact" variant="primary">
                Apply Now
              </Button>
            ) : (
              <Button href="/contact" variant="secondary">
                Express Interest
              </Button>
            )}
            <Button href="/careers" variant="ghost">
              All Careers
            </Button>
          </div>
        </FadeIn>

        <FadeIn className="mt-16 border-t border-brand-white/5 pt-8">
          <Link
            href="/careers"
            className="text-xs tracking-[0.2em] text-brand-grey uppercase transition-colors hover:text-brand-orange"
          >
            &larr; Back to Careers
          </Link>
        </FadeIn>
      </section>
    </>
  );
}
