import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { newsCategoryLabels } from "@/lib/data/content";
import { getAllNews } from "@/lib/supabase/queries/news";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "News",
  description:
    "Development logs, game updates, studio news, and technology articles from NNGTW Studio.",
};

const categories = Object.entries(newsCategoryLabels);

export default async function NewsPage() {
  const articles = await getAllNews();

  return (
    <>
      <PageHeader
        label="Updates"
        title="News"
        description="Development logs, game progress, studio updates, and technology insights."
      />

      <section className="mx-auto max-w-[1600px] px-6 pb-32 md:px-12 lg:px-20">
        <FadeIn>
          <div className="mb-12 flex flex-wrap gap-3">
            {categories.map(([key, label]) => (
              <span
                key={key}
                className="border border-brand-white/10 px-4 py-2 text-xs tracking-wider text-brand-grey uppercase"
              >
                {label}
              </span>
            ))}
          </div>
        </FadeIn>

        <StaggerContainer className="space-y-6">
          {articles.map((article) => (
            <StaggerItem key={article.id}>
              <Link href={`/news/${article.slug}`} className="group block">
                <article className="grid gap-6 border border-brand-white/5 p-8 transition-colors hover:border-brand-orange/20 md:grid-cols-[200px_1fr] md:p-10">
                  <div>
                    <time className="text-xs text-brand-grey">
                      {formatDate(article.publishedAt)}
                    </time>
                    <p className="mt-2 text-[10px] tracking-[0.2em] text-brand-orange uppercase">
                      {newsCategoryLabels[article.category]}
                    </p>
                  </div>
                  <div>
                    <h2 className="font-display text-xl tracking-wide text-brand-white uppercase transition-colors group-hover:text-brand-orange md:text-2xl">
                      {article.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-brand-grey">
                      {article.excerpt}
                    </p>
                  </div>
                </article>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>
    </>
  );
}
