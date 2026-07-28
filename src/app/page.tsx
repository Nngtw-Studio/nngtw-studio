import { Hero } from "@/components/sections/Hero";
import { FeaturedGames } from "@/components/sections/FeaturedGames";
import { WhatWeBuild } from "@/components/sections/WhatWeBuild";
import { AboutStudio } from "@/components/sections/AboutStudio";
import { Community } from "@/components/sections/Community";
import { LatestNews } from "@/components/sections/LatestNews";
import { Careers } from "@/components/sections/Careers";
import { ConnectCTA } from "@/components/sections/ConnectCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedGames />
      <WhatWeBuild />
      <AboutStudio />
      <Community />
      <LatestNews />
      <Careers />
      <ConnectCTA />
    </>
  );
}
