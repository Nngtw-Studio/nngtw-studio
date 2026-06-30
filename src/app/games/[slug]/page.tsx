import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { gameStatusLabels, newsCategoryLabels } from "@/lib/data/content";
import { getAllGames, getGameBySlug, getRelatedNews } from "@/lib/supabase/queries/games";
import { SOCIAL } from "@/lib/constants";

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
      <PageHeader
        label={gameStatusLabels[game.status]}
        title={game.title}
        description={game.description}
      />

      <section className="mx-auto max-w-[1600px] px-6 pb-32 md:px-12 lg:px-20">
        <FadeIn>
          <div className="relative mb-16 aspect-21/9 overflow-hidden bg-linear-to-br from-brand-orange/10 to-brand-black">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-7xl tracking-wider text-brand-white/5 uppercase md:text-9xl">
                {game.title.split(" ")[0]}
              </span>
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-brand-bg via-transparent to-transparent" />
          </div>
        </FadeIn>

        <div className="grid gap-16 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <FadeIn>
              <h2 className="font-display text-2xl tracking-wide text-brand-white uppercase">
                Overview
              </h2>
              <p className="mt-6 text-base leading-relaxed text-brand-grey md:text-lg">
                {game.overview ?? game.description}
              </p>
              {game.concept && (
                <>
                  <h2 className="mt-12 font-display text-2xl tracking-wide text-brand-white uppercase">
                    Concept
                  </h2>
                  <p className="mt-6 text-base leading-relaxed text-brand-grey">
                    {game.concept}
                  </p>
                </>
              )}
            </FadeIn>

            {game.roadmap && game.roadmap.length > 0 && (
              <FadeIn className="mt-16">
                <h2 className="font-display text-2xl tracking-wide text-brand-white uppercase">
                  Development Roadmap
                </h2>
                <div className="mt-8 space-y-0">
                  {game.roadmap.map((phase) => (
                    <div
                      key={phase.phase}
                      className="flex gap-6 border-l border-brand-white/10 py-6 pl-8"
                    >
                      <div className="relative">
                        <span className="absolute -left-9.25 flex h-3 w-3 items-center justify-center rounded-full border border-brand-orange bg-brand-black">
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                        </span>
                      </div>
                      <div>
                        <h3 className="font-display text-sm tracking-wider text-brand-white uppercase">
                          {phase.phase}
                        </h3>
                        <p className="mt-2 text-sm text-brand-grey">
                          {phase.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            )}
          </div>

          <div>
            <FadeIn delay={0.2}>
              <div className="glass-panel sticky top-28 p-8">
                <h3 className="text-xs tracking-[0.3em] text-brand-orange uppercase">
                  Details
                </h3>
                <dl className="mt-6 space-y-6">
                  <div>
                    <dt className="text-xs tracking-wider text-brand-grey uppercase">
                      Genre
                    </dt>
                    <dd className="mt-1 text-sm text-brand-white">{game.genre}</dd>
                  </div>
                  <div>
                    <dt className="text-xs tracking-wider text-brand-grey uppercase">
                      Platforms
                    </dt>
                    <dd className="mt-1 text-sm text-brand-white">
                      {game.platforms.join(", ")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs tracking-wider text-brand-grey uppercase">
                      Engine
                    </dt>
                    <dd className="mt-1 text-sm text-brand-white">{game.engine}</dd>
                  </div>
                  <div>
                    <dt className="text-xs tracking-wider text-brand-grey uppercase">
                      Status
                    </dt>
                    <dd className="mt-1 text-sm text-brand-white">
                      {gameStatusLabels[game.status]}
                    </dd>
                  </div>
                </dl>
                <div className="mt-8 space-y-3">
                  <Button href={SOCIAL.discord} variant="discord" size="sm" external className="w-full">
                    Join Discord
                  </Button>
                  <Button href="/games" variant="secondary" size="sm" className="w-full">
                    All Games
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

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
                    <p className="mt-2 text-sm text-brand-grey">{article.excerpt}</p>
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
