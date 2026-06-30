-- Add featured showcase fields to games table
ALTER TABLE games
  ADD COLUMN IF NOT EXISTS trailer_url TEXT,
  ADD COLUMN IF NOT EXISTS banner_image_url TEXT,
  ADD COLUMN IF NOT EXISTS project_link TEXT,
  ADD COLUMN IF NOT EXISTS follow_link TEXT,
  ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0;

-- Seed featured games (run after initial data exists or adjust slugs)
-- UPDATE games SET
--   featured = true,
--   active_development = true,
--   featured_order = 1,
--   trailer_url = '/videos/arithmetic-destination-trailer.mp4',
--   banner_image_url = '/banners/arithmetic-destination.svg',
--   project_link = '/games/arithmetic-destination',
--   follow_link = 'https://discord.gg/nngtw'
-- WHERE slug = 'arithmetic-destination';

-- UPDATE games SET
--   featured = true,
--   active_development = true,
--   featured_order = 2,
--   trailer_url = '/videos/king-summon-trailer.mp4',
--   banner_image_url = '/banners/king-summon.svg',
--   project_link = '/games/king-summon',
--   follow_link = 'https://discord.gg/nngtw'
-- WHERE slug = 'king-summon';
