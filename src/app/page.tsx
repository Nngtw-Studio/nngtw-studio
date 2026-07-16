import { Hero } from "@/components/sections/Hero";
import { FeaturedGames } from "@/components/sections/FeaturedGames";
import { AboutStudio } from "@/components/sections/AboutStudio";
import { TeamSection } from "@/components/sections/TeamSection";
import { Technology } from "@/components/sections/Technology";
import { Community } from "@/components/sections/Community";
import { LatestNews } from "@/components/sections/LatestNews";
import { Careers } from "@/components/sections/Careers";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedGames />
      <AboutStudio />
      <TeamSection />
      <Technology />
      <Community />
      <LatestNews />
      <Careers />
      <ContactCTA />
    </>
  );
}
