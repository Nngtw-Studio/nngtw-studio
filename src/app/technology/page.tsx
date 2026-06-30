import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { technologyPageContent, technologyCategories } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Technology",
  description:
    "How NNGTW Studio builds games — engines, art pipelines, programming, and XR vision.",
};

export default function TechnologyPage() {
  return (
    <>
      <PageHeader
        label="How We Build"
        title="Technology"
        description={technologyPageContent.intro}
      />

      <section className="mx-auto max-w-[1600px] px-6 pb-32 md:px-12 lg:px-20">
        <StaggerContainer className="space-y-16">
          {technologyPageContent.sections.map((section) => (
            <StaggerItem key={section.title}>
              <div className="grid gap-8 border-b border-brand-white/5 pb-16 lg:grid-cols-3">
                <h2 className="font-display text-xl tracking-wide text-brand-white uppercase lg:text-2xl">
                  {section.title}
                </h2>
                <p className="text-base leading-relaxed text-brand-grey lg:col-span-2">
                  {section.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn className="mt-24">
          <h2 className="font-display text-2xl tracking-wide text-brand-white uppercase">
            Full Stack
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {technologyCategories.map((category) => (
              <div
                key={category.id}
                className="border border-brand-white/5 p-8"
              >
                <h3 className="font-display text-lg tracking-wide text-brand-orange uppercase">
                  {category.title}
                </h3>
                <div className="mt-6 flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="border border-brand-white/10 px-3 py-1.5 text-xs text-brand-grey"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>
    </>
  );
}
