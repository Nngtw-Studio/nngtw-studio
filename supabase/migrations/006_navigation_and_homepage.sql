-- =============================================================================
-- Migration 006: Navigation items table + homepage CMS row + missing settings
-- =============================================================================
-- Adds a studio_navigation_items table so the admin Navigation page has a real
-- table to manage (mirrors studio_team_members / studio_technology_categories).
-- Seeds one studio_pages row (slug='homepage') so the admin Homepage/SEO
-- editor has something to load. Seeds two additional studio_settings keys
-- (tagline, site_url) that the admin Settings page already displayed as
-- read-only placeholders sourced from BRAND constants.
--
-- Per this round's scope: none of this is read by the public site yet — the
-- public site continues reading NAV_LINKS/BRAND from src/lib/constants.ts.
-- This migration only makes the admin panel itself functional.
-- =============================================================================

CREATE TABLE IF NOT EXISTS studio_navigation_items (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  label      TEXT        NOT NULL,
  href       TEXT        NOT NULL,
  "order"    INTEGER     DEFAULT 0,
  visible    BOOLEAN     DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_studio_nav_order ON studio_navigation_items("order");

ALTER TABLE studio_navigation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "studio: public read visible nav items"
  ON studio_navigation_items FOR SELECT USING (visible = true);

CREATE POLICY "studio: admin all nav items"
  ON studio_navigation_items FOR ALL USING (auth.role() = 'authenticated');

-- Seed from current NAV_LINKS constant (src/lib/constants.ts)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM studio_navigation_items LIMIT 1) THEN
    INSERT INTO studio_navigation_items (label, href, "order", visible) VALUES
      ('Games',      '/games',      1, true),
      ('Studio',     '/studio',     2, true),
      ('Technology', '/technology', 3, true),
      ('News',       '/news',       4, true),
      ('Careers',    '/careers',    5, true),
      ('Contact',    '/contact',    6, true);
  END IF;
END $$;

-- Seed the homepage CMS row (studio_pages was reserved/unused until now)
INSERT INTO studio_pages (slug, title, content, published, seo_title, seo_description, og_image)
VALUES (
  'homepage',
  'Homepage',
  '{"heroSubtitle": "Nngtw Studio is an independent game development studio creating original games for PC, Mobile, XR and Virtual Reality.", "ctaPrimaryLabel": "Explore Worlds", "ctaPrimaryHref": "/games", "ctaSecondaryLabel": "Enter Studio", "ctaSecondaryHref": "/studio"}',
  true,
  'Nngtw Studio — Building Immersive Worlds',
  'Nngtw Studio is an independent game development studio creating original games for PC, Mobile, XR and Virtual Reality.',
  NULL
)
ON CONFLICT (slug) DO NOTHING;

-- Add the two settings keys the admin Settings page already displayed
-- (previously sourced from the BRAND constant, not a real row)
INSERT INTO studio_settings (key, value) VALUES
  ('tagline',  '"Imagine. Explore. Evolve."'),
  ('site_url', '"https://nngtw.studio"')
ON CONFLICT (key) DO NOTHING;
