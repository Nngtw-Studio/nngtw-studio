import { Hero } from "@/components/sections/Hero";
import { FeaturedGames } from "@/components/sections/FeaturedGames";
import { AboutStudio } from "@/components/sections/AboutStudio";
import { Technology } from "@/components/sections/Technology";
import { Community } from "@/components/sections/Community";
import { LatestNews } from "@/components/sections/LatestNews";
import { Careers } from "@/components/sections/Careers";
import { ConnectCTA } from "@/components/sections/ConnectCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedGames />
      <AboutStudio />
      <Technology />
      <Community />
      <LatestNews />
      <Careers />
      <ConnectCTA />
    </>
  );
}
