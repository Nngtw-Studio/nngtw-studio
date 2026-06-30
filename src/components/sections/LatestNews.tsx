/** @format */

import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';
import { Button } from '@/components/ui/Button';
import { newsArticles, newsCategoryLabels } from '@/lib/data/content';
import { formatDate } from '@/lib/utils';

export function LatestNews() {
  const [featured, ...rest] = newsArticles.slice(0, 4);

  return (
    <section className="section-padding mx-auto max-w-[1600px]">
      {/* Header */}
      <FadeIn>
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-overline mb-8 text-brand-grey/60">Latest News</p>
            <h2 className="editorial-heading text-4xl text-brand-white md:text-5xl lg:text-6xl">
              Development
              <br />
              updates.
            </h2>
          </div>
          <Button href="/news" variant="ghost" size="sm">
            All News &rarr;
          </Button>
        </div>
      </FadeIn>

      {/* Featured article — full width, editorial */}
      {featured && (
        <FadeIn>
          <Link href={`/news/${featured.slug}`} className="group mb-px block">
            <article className="border border-brand-white/5 p-8 transition-colors duration-500 hover:border-brand-white/10 md:p-14">
              <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-4">
                  <div className="flex items-center gap-4">
                    <span className="label-overline text-brand-orange">
                      {newsCategoryLabels[featured.category]}
                    </span>
                    <span className="text-brand-white/15">·</span>
                    <time className="font-accent text-[10px] tracking-[0.2em] text-brand-grey/50">
                      {formatDate(featured.publishedAt)}
                    </time>
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <h3 className="editorial-heading text-2xl text-brand-white transition-colors duration-300 group-hover:text-brand-white/80 md:text-3xl lg:text-4xl">
                    {featured.title}
                  </h3>
                  <p className="mt-5 text-sm leading-8 text-brand-grey/70 lg:max-w-xl">
                    {featured.excerpt}
                  </p>
                  <span className="mt-6 inline-block font-accent text-[10px] tracking-[0.3em] uppercase text-brand-grey/40 transition-colors duration-300 group-hover:text-brand-white/60">
                    Read more &rarr;
                  </span>
                </div>
              </div>
            </article>
          </Link>
        </FadeIn>
      )}

      {/* Remaining articles — compact list */}
      <StaggerContainer className="divide-y divide-brand-white/5">
        {rest.map((article, index) => (
          <StaggerItem key={article.id}>
            <Link href={`/news/${article.slug}`} className="group block">
              <article className="grid gap-6 py-8 transition-colors duration-300 md:grid-cols-12 md:gap-12 md:items-baseline">
                <div className="flex items-center gap-3 md:col-span-1">
                  <span className="font-accent text-[10px] tracking-[0.2em] text-brand-grey/25">
                    {String(index + 2).padStart(2, '0')}
                  </span>
                </div>
                <div className="md:col-span-3">
                  <span className="label-overline text-brand-grey/50">
                    {newsCategoryLabels[article.category]}
                  </span>
                </div>
                <div className="md:col-span-6">
                  <h3 className="font-display text-base font-semibold tracking-tight text-brand-white/80 transition-colors duration-300 group-hover:text-brand-white md:text-lg">
                    {article.title}
                  </h3>
                </div>
                <div className="md:col-span-2 md:text-right">
                  <time className="font-accent text-[10px] tracking-[0.15em] text-brand-grey/40">
                    {formatDate(article.publishedAt)}
                  </time>
                </div>
              </article>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
