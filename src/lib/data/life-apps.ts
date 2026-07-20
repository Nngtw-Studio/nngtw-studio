/** @format */

/**
 * Gamified Life Apps — the studio's product direction beyond traditional
 * games. No titles are announced yet, so this content describes the
 * initiative and its design pillars rather than inventing product names.
 * Replace pillars with real products as they are revealed.
 */

export interface LifeAppPillar {
  id: string;
  title: string;
  tagline: string;
  description: string;
  status: string;
}

export const lifeAppsContent = {
  label: 'Beyond Games',
  title: 'Gamified Life Apps',
  intro:
    'The same systems that make our worlds worth returning to — progression, streaks, discovery, reward — applied to the one world everyone already plays in. A new class of apps that make everyday life feel like a campaign worth finishing.',
  note: 'First explorations are underway inside the studio. Titles, names, and early access will be announced on Discord before anywhere else.',
  pillars: [
    {
      id: 'habit-routine',
      title: 'Habit & Routine',
      tagline: 'Daily life as a progression system',
      description:
        'Quests, streaks, and momentum loops that turn routines into runs — designed so showing up every day feels like levelling, not logging.',
      status: 'In Exploration',
    },
    {
      id: 'learning-curiosity',
      title: 'Learning & Curiosity',
      tagline: 'Knowledge as an open world',
      description:
        'Building on everything Arithmetic Destination taught us — skills mapped like territories, mastery earned through play rather than drills.',
      status: 'In Exploration',
    },
    {
      id: 'wellness-focus',
      title: 'Wellness & Focus',
      tagline: 'Calm, engineered like a game feel',
      description:
        'Focus sessions framed as expeditions, rest treated as a resource, and progress you can feel — without the guilt mechanics of typical trackers.',
      status: 'In Research',
    },
  ] satisfies LifeAppPillar[],
};
