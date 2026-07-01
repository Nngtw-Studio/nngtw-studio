import type {
  Career,
  Game,
  NewsArticle,
  PhilosophyValue,
  TeamMember,
  TechnologyCategory,
} from "@/types";

export const activeGames: Game[] = [
  {
    id: "1",
    slug: "arithmetic-destination",
    title: "Arithmetic Destination",
    genre: "Educational Adventure",
    platforms: ["PC", "Mobile"],
    engine: "Unity",
    status: "in-development",
    description:
      "An immersive educational journey where mathematics becomes exploration. Navigate abstract worlds built from numbers, patterns, and logic.",
    overview:
      "Arithmetic Destination transforms mathematical concepts into explorable environments. Players journey through visually distinct realms — each representing fundamental mathematical principles — solving puzzles that feel like discovery rather than homework.",
    featured: true,
    activeDevelopment: true,
    featuredOrder: 1,
    trailerUrl: "/videos/arithmetic-destination-trailer.mp4",
    bannerImageUrl: "/banners/arithmetic-destination.svg",
    projectLink: "/games/arithmetic-destination",
    followLink: "https://discord.gg/nngtw",
    gallery: [],
    roadmap: [
      { phase: "Core Mechanics", description: "Number-based puzzle systems and world traversal" },
      { phase: "World Building", description: "First three mathematical realms with unique art direction" },
      { phase: "Playtesting", description: "Community feedback sessions via Discord" },
      { phase: "Platform Polish", description: "PC and Mobile optimization" },
    ],
    createdAt: "2024-06-01",
    updatedAt: "2026-06-15",
  },
  {
    id: "2",
    slug: "king-summon",
    title: "King Summon",
    genre: "Strategy / Summoning",
    platforms: ["PC", "Mobile"],
    engine: "Unity",
    status: "in-development",
    description:
      "Command armies of summoned creatures in tactical battles. Build your kingdom, forge alliances, and master the art of summoning.",
    overview:
      "King Summon blends strategic depth with accessible summoning mechanics. Players build and expand their kingdom while commanding diverse creature armies in tactical combat. Every summon matters — positioning, timing, and synergy define victory.",
    featured: true,
    activeDevelopment: true,
    featuredOrder: 2,
    trailerUrl: "/videos/king-summon-trailer.mp4",
    bannerImageUrl: "/banners/king-summon.svg",
    projectLink: "/games/king-summon",
    followLink: "https://discord.gg/nngtw",
    gallery: [],
    roadmap: [
      { phase: "Combat Prototype", description: "Core summoning and battle loop" },
      { phase: "Kingdom Systems", description: "Building, resources, and progression" },
      { phase: "Creature Design", description: "Initial roster with unique abilities" },
      { phase: "Multiplayer Foundation", description: "Async and real-time battle modes" },
    ],
    createdAt: "2025-01-15",
    updatedAt: "2026-06-20",
  },
];

export const plannedGames: Game[] = [
  {
    id: "3",
    slug: "on-earth",
    title: "On Earth",
    genre: "Narrative Exploration",
    platforms: ["PC", "XR"],
    engine: "Unreal Engine",
    status: "planned",
    description:
      "A contemplative journey across a transformed Earth. Explore remnants of civilization and nature reclaiming the world.",
    concept:
      "On Earth envisions a post-human landscape where nature has begun to heal. Players explore at their own pace, uncovering environmental storytelling and making choices that shape how the world remembers humanity.",
    featured: false,
    activeDevelopment: false,
    createdAt: "2025-06-01",
    updatedAt: "2026-03-01",
  },
  {
    id: "4",
    slug: "bored-zombie",
    title: "Bored Zombie",
    genre: "Casual / Comedy",
    platforms: ["Mobile", "PC"],
    engine: "Unity",
    status: "planned",
    description:
      "Life as an undead office worker. Navigate mundane daily routines with a darkly comedic twist.",
    concept:
      "Bored Zombie reimagines the zombie genre through absurdist humor. Our undead protagonist shuffles through everyday tasks — commuting, meetings, lunch breaks — finding unexpected meaning in monotony.",
    featured: false,
    activeDevelopment: false,
    createdAt: "2025-08-01",
    updatedAt: "2026-04-01",
  },
  {
    id: "5",
    slug: "the-vastness",
    title: "The Vastness",
    genre: "Space Exploration",
    platforms: ["PC", "VR"],
    engine: "Unreal Engine",
    status: "planned",
    description:
      "Drift through the infinite cosmos. A meditative space experience focused on scale, solitude, and wonder.",
    concept:
      "The Vastness is designed for VR-first exploration of procedurally generated star systems. Minimal UI, maximum immersion — players experience the awe of cosmic scale through sound design and visual spectacle.",
    featured: false,
    activeDevelopment: false,
    createdAt: "2025-10-01",
    updatedAt: "2026-05-01",
  },
];

export const allGames = [...activeGames, ...plannedGames];

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Founder",
    role: "Founder & Creative Director",
    bio: "Vision, creative direction, and studio leadership.",
    order: 1,
  },
  {
    id: "2",
    name: "Community Lead",
    role: "Marketing & Community",
    bio: "Player engagement, social presence, and community growth.",
    order: 2,
  },
  {
    id: "3",
    name: "XR Developer",
    role: "XR Developer",
    bio: "Immersive technology research and XR prototyping.",
    order: 3,
  },
  {
    id: "4",
    name: "Frontend Developer",
    role: "Frontend Developer",
    bio: "Web applications, studio tools, and interactive experiences.",
    order: 4,
  },
];

export const technologyCategories: TechnologyCategory[] = [
  {
    id: "game-dev",
    title: "Game Development",
    items: ["Unity", "Unreal Engine", "Unreal Blueprints", "C#", "C++", "OpenXR"],
    description: "Industry-standard engines and languages powering our game projects.",
  },
  {
    id: "web-apps",
    title: "Web & Applications",
    items: [
      "React",
      "Next.js",
      "React Native",
      "JavaScript",
      "TypeScript",
      "Firebase",
      "Supabase",
      "SQL",
    ],
    description: "Modern web stack for applications, tools, and studio infrastructure.",
  },
  {
    id: "art",
    title: "Art & Concept",
    items: [
      "Blender",
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Sketchbook Pro",
      "Adobe Premiere Pro",
      "Adobe After Effects",
    ],
    description: "Creative tools for concept art, 3D modeling, and visual production.",
  },
  {
    id: "future",
    title: "Future Technologies",
    items: [
      "XR",
      "VR",
      "Mixed Reality",
      "AI Assisted Workflows",
      "Interactive Computing",
    ],
    description: "Emerging technologies shaping our long-term vision.",
  },
];

export const philosophyValues: PhilosophyValue[] = [
  {
    id: "1",
    title: "Player First",
    description: "Every decision starts with the player experience. We build games people genuinely want to play.",
  },
  {
    id: "2",
    title: "Original Worlds",
    description: "We create unique universes with distinct identity — never derivative, always authentic.",
  },
  {
    id: "3",
    title: "Free-to-Play Philosophy",
    description: "Accessibility matters. Our free-to-play titles remove barriers to entry without compromising quality.",
  },
  {
    id: "4",
    title: "Fair Monetization",
    description: "Players should never feel exploited. Cosmetic and convenience options — never pay-to-win.",
  },
  {
    id: "5",
    title: "Long-term Communities",
    description: "We invest in communities that grow with our games over years, not months.",
  },
  {
    id: "6",
    title: "Innovation through Technology",
    description: "We embrace new tools and platforms to push what independent studios can achieve.",
  },
  {
    id: "7",
    title: "Cross-platform Thinking",
    description: "Games should reach players wherever they are — PC, mobile, console, and beyond.",
  },
  {
    id: "8",
    title: "Immersive Experiences",
    description: "From screen to headset, we design experiences that pull players into our worlds.",
  },
];

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    slug: "king-summon-combat-prototype",
    title: "King Summon: Combat Prototype Milestone",
    excerpt:
      "The core summoning and battle loop is now playable internally. Early feedback is shaping creature abilities and battle pacing.",
    content:
      "We've reached a significant milestone on King Summon — the combat prototype is now fully playable internally. The summoning system allows players to call creatures with distinct roles: tanks, damage dealers, and support units. Battle pacing emphasizes tactical positioning over reflexes.\n\nNext steps include expanding the creature roster and integrating kingdom-building mechanics that feed into combat strength.",
    category: "development-log",
    publishedAt: "2026-06-20",
    featured: true,
  },
  {
    id: "2",
    slug: "arithmetic-destination-first-realm",
    title: "Arithmetic Destination: First Realm Complete",
    excerpt:
      "The Number Forest realm is complete — our first fully explorable mathematical environment.",
    content:
      "The Number Forest represents fundamental arithmetic through environmental design. Trees grow in Fibonacci spirals, rivers flow along number lines, and puzzles emerge naturally from the landscape.\n\nThis realm serves as our template for future mathematical worlds in Arithmetic Destination.",
    category: "game-update",
    publishedAt: "2026-06-10",
    featured: true,
  },
  {
    id: "3",
    slug: "studio-discord-community-launch",
    title: "Nngtw Discord Community Now Open",
    excerpt:
      "Join our Discord to follow development, share feedback, and participate in future playtests.",
    content:
      "Our Discord community is now live. This is where development happens in the open — dev logs, behind-the-scenes content, and direct communication with the team.\n\nFuture playtest opportunities will be announced exclusively through Discord first.",
    category: "announcement",
    publishedAt: "2026-05-28",
  },
  {
    id: "4",
    slug: "openxr-research-update",
    title: "OpenXR Integration Research",
    excerpt:
      "Exploring cross-platform XR development with OpenXR for future immersive projects.",
    content:
      "As part of our long-term vision for XR and VR, we're researching OpenXR integration across Unity and Unreal Engine. This will enable our planned titles like The Vastness and On Earth to target multiple headset platforms from a single codebase.",
    category: "technology",
    publishedAt: "2026-05-15",
  },
  {
    id: "5",
    slug: "welcome-to-nngtw-studio",
    title: "Welcome to Nngtw Studio",
    excerpt:
      "Introducing our studio — an independent team building original games with a vision for immersive futures.",
    content:
      "Nngtw Studio is officially launching its public presence. We're a small, focused team creating original games for PC, mobile, and eventually XR platforms.\n\nOur first titles — Arithmetic Destination and King Summon — are actively in development. Follow along as we share our journey.",
    category: "studio-news",
    publishedAt: "2026-05-01",
  },
];

export const careers: Career[] = [
  {
    id: "1",
    slug: "game-programmer",
    title: "Game Programmer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    status: "future",
    description:
      "Join our engineering team to build gameplay systems, tools, and infrastructure for our active projects.",
    requirements: [
      "Strong C# or C++ experience",
      "Unity or Unreal Engine proficiency",
      "Passion for game development",
      "Self-directed and collaborative",
    ],
  },
  {
    id: "2",
    slug: "game-designer",
    title: "Game Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    status: "future",
    description:
      "Shape game mechanics, systems design, and player experience across our portfolio.",
    requirements: [
      "Portfolio demonstrating systems thinking",
      "Understanding of player psychology",
      "Experience with prototyping",
      "Strong communication skills",
    ],
  },
  {
    id: "3",
    slug: "3d-artist",
    title: "3D Artist",
    department: "Art",
    location: "Remote",
    type: "Full-time",
    status: "future",
    description:
      "Create environments, props, and characters that bring our game worlds to life.",
    requirements: [
      "Proficiency in Blender or similar",
      "Strong understanding of game art pipelines",
      "Portfolio of 3D work",
      "Ability to match art direction",
    ],
  },
  {
    id: "4",
    slug: "technical-artist",
    title: "Technical Artist",
    department: "Art",
    location: "Remote",
    type: "Full-time",
    status: "future",
    description:
      "Bridge art and engineering — shaders, VFX, optimization, and pipeline tools.",
    requirements: [
      "Shader programming experience",
      "Engine tool development",
      "Strong artistic and technical skills",
      "Performance optimization knowledge",
    ],
  },
  {
    id: "5",
    slug: "animator",
    title: "Animator",
    department: "Art",
    location: "Remote",
    type: "Full-time",
    status: "future",
    description: "Bring characters and creatures to life with compelling animation.",
    requirements: [
      "Character animation portfolio",
      "Experience with game animation pipelines",
      "Understanding of locomotion and combat animation",
    ],
  },
  {
    id: "6",
    slug: "xr-developer",
    title: "XR Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    status: "future",
    description:
      "Research and develop immersive experiences for our XR and VR roadmap.",
    requirements: [
      "OpenXR or platform-specific XR experience",
      "Unity or Unreal VR development",
      "Comfort with emerging technology",
      "Spatial design awareness",
    ],
  },
  {
    id: "7",
    slug: "frontend-developer",
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    status: "future",
    description:
      "Build web applications, studio tools, and interactive experiences.",
    requirements: [
      "React / Next.js proficiency",
      "TypeScript experience",
      "UI/UX sensibility",
      "Experience with real-time data",
    ],
  },
  {
    id: "8",
    slug: "ui-ux-designer",
    title: "UI/UX Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    status: "future",
    description: "Design intuitive interfaces for games and studio applications.",
    requirements: [
      "Game UI portfolio",
      "User research experience",
      "Figma or similar proficiency",
      "Understanding of accessibility",
    ],
  },
  {
    id: "9",
    slug: "qa-tester",
    title: "QA Tester",
    department: "Quality",
    location: "Remote",
    type: "Full-time",
    status: "future",
    description: "Ensure quality across all platforms through systematic testing.",
    requirements: [
      "Detail-oriented mindset",
      "Experience writing bug reports",
      "Multi-platform gaming experience",
      "Patience and persistence",
    ],
  },
  {
    id: "10",
    slug: "marketing-intern",
    title: "Marketing Intern",
    department: "Marketing",
    location: "Remote",
    type: "Internship",
    status: "internship",
    description:
      "Learn game marketing while supporting our community and social presence.",
    requirements: [
      "Passion for games and game culture",
      "Social media familiarity",
      "Creative writing ability",
      "Currently enrolled in relevant program",
    ],
  },
  {
    id: "11",
    slug: "community-manager",
    title: "Community Manager",
    department: "Community",
    location: "Remote",
    type: "Full-time",
    status: "future",
    description:
      "Grow and nurture our player community across Discord and social platforms.",
    requirements: [
      "Community management experience",
      "Excellent communication",
      "Conflict resolution skills",
      "Genuine love for games",
    ],
  },
];

export const studioContent = {
  vision:
    "To create original interactive worlds that inspire players to imagine, explore, and evolve — from screens to immersive realities.",
  mission:
    "Nngtw Studio develops original games and interactive products with AAA presentation quality, built by a passionate independent team focused on player-first experiences.",
  values: philosophyValues,
  developmentPhilosophy:
    "We prototype fast, iterate with community feedback, and polish until every interaction feels intentional. Small team, big ambition — we leverage modern tools and cross-platform thinking to compete with studios ten times our size.",
  longTermGoals: [
    "Release Arithmetic Destination and King Summon to global audiences",
    "Expand into XR and VR with titles like The Vastness and On Earth",
    "Build lasting player communities around every title",
    "Grow the team thoughtfully while preserving creative independence",
    "Develop interactive applications beyond traditional games",
  ],
};

export const technologyPageContent = {
  intro:
    "We combine industry-standard game engines with modern web technology and emerging XR platforms. Our toolchain is chosen for capability, not trend — every technology serves the player experience.",
  sections: [
    {
      title: "Game Development",
      description:
        "Unity powers our active mobile and PC titles. Unreal Engine drives our planned XR experiences. C# and C++ form the backbone of gameplay systems, while OpenXR ensures future cross-platform headset support.",
    },
    {
      title: "Art Pipeline",
      description:
        "Concept art begins in Photoshop and Illustrator, moves to Blender for 3D production, and finishes with Premiere and After Effects for trailers and promotional content. Every asset passes through a consistent quality bar.",
    },
    {
      title: "Programming",
      description:
        "Clean architecture, data-driven design, and performance-first thinking. We build systems that scale from prototype to production without rewrites.",
    },
    {
      title: "Interactive Applications",
      description:
        "Beyond games, we build web and mobile applications using React, Next.js, and React Native — backed by Supabase and Firebase for real-time, scalable infrastructure.",
    },
    {
      title: "XR and VR Vision",
      description:
        "OpenXR integration research is underway. Our planned titles The Vastness and On Earth are designed with immersive platforms in mind from day one.",
    },
    {
      title: "Development Pipeline",
      description:
        "Version control, automated builds, community playtesting via Discord, and iterative development cycles. We ship early internally, polish with feedback, and release when ready — never before.",
    },
  ],
};

export function getGameBySlug(slug: string): Game | undefined {
  return allGames.find((g) => g.slug === slug);
}

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return newsArticles.find((n) => n.slug === slug);
}

export function getCareerBySlug(slug: string): Career | undefined {
  return careers.find((c) => c.slug === slug);
}

export const newsCategoryLabels: Record<string, string> = {
  "development-log": "Development Logs",
  "game-update": "Game Updates",
  "studio-news": "Studio News",
  technology: "Technology",
  announcement: "Announcements",
};

export const careerStatusLabels: Record<string, string> = {
  open: "Open",
  internship: "Internship",
  future: "Future Opportunity",
  closed: "Closed",
};

export const gameStatusLabels: Record<string, string> = {
  "in-development": "In Development",
  planned: "Planned",
  released: "Released",
  concept: "Concept",
};
