import type { Metadata } from "next";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { CareersHero } from "@/components/sections/CareersHero";
import { RoleCard } from "@/components/sections/RoleCard";
import { getAllCareers } from "@/lib/supabase/queries/careers";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Nngtw Studio — game development careers and future opportunities.",
};

/**
 * Two bands, because "we're hiring right now" and "we'll hire for this
 * eventually" are different promises to a candidate. Status drives the
 * split — nothing is hardcoded per role, so a role moving from `future`
 * to `open` in the admin moves it between bands (and into the hero) with
 * no code change.
 */
export default async function CareersPage() {
  const careers = await getAllCareers();

  const openRoles = careers.filter(
    (c) => c.status === "open" || c.status === "internship"
  );
  const futureRoles = careers.filter((c) => c.status === "future");

  return (
    <>
      <CareersHero openRoles={openRoles} totalRoles={careers.length} />

      <section
        id="all-roles"
        className="relative mx-auto max-w-[1600px] scroll-mt-24 px-6 pb-32 md:px-12 lg:px-20 xl:px-28"
      >
        {openRoles.length > 0 && (
          <div className="mb-20">
            <FadeIn>
              <div className="mb-3 flex flex-wrap items-baseline gap-4">
                <h2 className="editorial-heading text-3xl text-brand-white md:text-4xl">
                  Open Positions
                </h2>
                <span className="border border-brand-orange/30 bg-brand-orange/10 px-2.5 py-0.5 label-overline text-brand-orange">
                  Applications open
                </span>
              </div>
              <p className="mb-10 max-w-2xl body-description">
                Reviewed as they come in. Apply straight from the role page —
                no account, no portal.
              </p>
            </FadeIn>

            <StaggerContainer className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {openRoles.map((career) => (
                <StaggerItem key={career.id}>
                  <RoleCard role={career} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}

        {futureRoles.length > 0 && (
          <div>
            <FadeIn>
              <h2 className="editorial-heading mb-3 text-3xl text-brand-white md:text-4xl">
                Future Opportunities
              </h2>
              <p className="mb-10 max-w-2xl body-description">
                Not open yet — these are the roles we expect to hire for as the
                studio grows. If one of them is yours, introduce yourself early
                and we&apos;ll come to you first.
              </p>
            </FadeIn>

            <StaggerContainer className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {futureRoles.map((career) => (
                <StaggerItem key={career.id}>
                  <RoleCard role={career} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}
      </section>
    </>
  );
}
