-- =============================================================================
-- Migration 007: Team bento showcase — contribution weighting + real roster
-- =============================================================================
-- Adds the columns the new "Meet the Studio" bento grid needs beyond the
-- original studio_team_members schema (migration 003):
--   contribution        — short editorial summary shown on the card itself
--   contribution_weight — drives bento sizing (higher = more prominent)
--   profile_url         — external URL (Reagan) or internal /team/<slug> route
--
-- avatar_url is reused as-is, but its *meaning* changes: it now stores a
-- path relative to the nngtw-assets bucket (e.g. "profile/Nngtw_team/lenin.png"),
-- resolved to a full URL at read time via getStorageUrl() — never a raw URL.
--
-- Then replaces the four placeholder rows seeded in 003 with the real
-- studio roster. Targeted by "order" (1-4), which 003 assigned uniquely and
-- the admin UI has relied on since — safe to rerun.
-- =============================================================================

ALTER TABLE studio_team_members
  ADD COLUMN IF NOT EXISTS contribution TEXT,
  ADD COLUMN IF NOT EXISTS contribution_weight INTEGER DEFAULT 50,
  ADD COLUMN IF NOT EXISTS profile_url TEXT;

UPDATE studio_team_members SET
  name = 'Reagan Sagolsem',
  role = 'Founder & Creative Director',
  contribution = 'Leading NNGTW''s vision, product strategy, creative direction, studio culture and long-term roadmap.',
  bio = 'Vision, creative direction, and studio leadership.',
  avatar_url = 'profile/Nngtw_team/reagan.png',
  profile_url = 'https://reagan.nngtw.com',
  contribution_weight = 100
WHERE "order" = 1;

UPDATE studio_team_members SET
  name = 'Lenin Akoijam',
  role = 'Game Developer',
  contribution = 'Gameplay programming, systems design, prototyping and technical implementation across studio projects.',
  bio = 'Core gameplay systems and technical implementation.',
  avatar_url = 'profile/Nngtw_team/lenin.png',
  profile_url = '/team/lenin',
  contribution_weight = 80
WHERE "order" = 2;

UPDATE studio_team_members SET
  name = 'Nirmala Salam',
  role = 'Digital Marketing Associate',
  contribution = 'Community growth, social media, campaigns, brand visibility and player engagement.',
  bio = 'Player engagement, social presence, and community growth.',
  avatar_url = 'profile/Nngtw_team/nirmala.jpeg',
  profile_url = '/team/nirmala',
  contribution_weight = 60
WHERE "order" = 3;

UPDATE studio_team_members SET
  name = 'Akash Meishnam',
  role = 'Technical Advisor',
  contribution = 'Technical consulting, architecture reviews and strategic engineering guidance.',
  bio = 'Engineering guidance and architecture reviews.',
  avatar_url = 'profile/Nngtw_team/akash.png',
  profile_url = '/team/akash',
  contribution_weight = 40
WHERE "order" = 4;
