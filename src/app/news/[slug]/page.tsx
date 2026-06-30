import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { FadeIn } from "@/components/motion/FadeIn";
import { newsCategoryLabels } from "@/lib/data/content";
import { getAllNews, getNewsBySlug } from "@/lib/supabase/queries/news";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getAllNews();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <PageHeader label={newsCategoryLabels[article.category]} title={article.title} />

      <article className="mx-auto max-w-3xl px-6 pb-32 md:px-12">
        <FadeIn>
          <time className="text-sm text-brand-grey">
            {formatDate(article.publishedAt)}
          </time>
          <div className="mt-12 space-y-6">
            {article.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-brand-grey md:text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </FadeIn>

        <FadeIn className="mt-16 border-t border-brand-white/5 pt-8">
          <Link
            href="/news"
            className="text-xs tracking-[0.2em] text-brand-grey uppercase transition-colors hover:text-brand-orange"
          >
            &larr; Back to News
          </Link>
        </FadeIn>
      </article>
    </>
  );
}
