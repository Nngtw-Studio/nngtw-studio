import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { GameHero } from "@/components/sections/GameHero";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { GameTrailer } from "@/components/sections/GameTrailer";
import { newsCategoryLabels } from "@/lib/data/content";
import { getAllGames, getGameBySlug, getRelatedNews } from "@/lib/supabase/queries/games";

export const revalidate = 3600;
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const games = await getAllGames();
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return { title: "Game Not Found" };
  return {
    title: game.title,
    description: game.description,
  };
}

export default async function GameDetailPage({ params }: Props) {
  const { slug } = await params;
  const [game, relatedNews] = await Promise.all([
    getGameBySlug(slug),
    getRelatedNews(slug.split("-")[0]),
  ]);
  if (!game) notFound();

  return (
    <>
      <GameHero game={game} />

      <section className="mx-auto max-w-[1600px] px-6 pt-20 pb-32 md:px-12 lg:px-20">
        <div className="max-w-3xl">
          <FadeIn>
            <h2 className="font-display text-2xl tracking-wide text-brand-white uppercase">
              Overview
            </h2>
            <p className="mt-6 body-description">
              {game.overview ?? game.description}
            </p>
            {game.concept && (
              <>
                <h2 className="mt-12 font-display text-2xl tracking-wide text-brand-white uppercase">
                  Concept
                </h2>
                <p className="mt-6 body-description">
                  {game.concept}
                </p>
              </>
            )}
          </FadeIn>
        </div>

        {game.trailerUrl && (
          <FadeIn className="mt-16">
            <h2 className="mb-6 font-display text-2xl tracking-wide text-brand-white uppercase">
              Official Trailer
            </h2>
            <GameTrailer
              title={game.title}
              trailerUrl={game.trailerUrl}
              posterUrl={game.bannerImageUrl}
            />
          </FadeIn>
        )}

        {relatedNews.length > 0 && (
          <FadeIn className="mt-24">
            <h2 className="font-display text-2xl tracking-wide text-brand-white uppercase">
              Development Updates
            </h2>
            <StaggerContainer className="mt-8 space-y-4">
              {relatedNews.map((article) => (
                <StaggerItem key={article.id}>
                  <Link
                    href={`/news/${article.slug}`}
                    className="group block border border-brand-white/5 p-6 transition-colors hover:border-brand-orange/20"
                  >
                    <span className="text-[10px] tracking-[0.2em] text-brand-orange uppercase">
                      {newsCategoryLabels[article.category]}
                    </span>
                    <h3 className="mt-2 font-display text-lg tracking-wide text-brand-white uppercase transition-colors group-hover:text-brand-orange">
                      {article.title}
                    </h3>
                    <p className="mt-2 body-description">{article.excerpt}</p>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </FadeIn>
        )}
      </section>
    </>
  );
}
