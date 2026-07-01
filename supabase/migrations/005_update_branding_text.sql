-- =============================================================================
-- Migration 005: Update seeded branding text to "Nngtw Studio" / "Nngtw"
-- =============================================================================
-- Migrations 001 and 003 seeded rows using the old "NNGTW Studio" / "NNGTW"
-- casing. Since those migrations have already run in production, editing
-- their historical INSERT statements would not change existing rows — this
-- migration UPDATEs the previously seeded data directly instead.
--
-- Only display text is touched. Slugs (studio-discord-community-launch,
-- welcome-to-nngtw-studio) are left as-is — they're URL identifiers, not
-- user-facing branding.
-- =============================================================================

UPDATE studio_settings
SET value = '"Nngtw Studio"'
WHERE key = 'studio_name' AND value = '"NNGTW Studio"';

UPDATE studio_news_articles
SET title = 'Nngtw Discord Community Now Open'
WHERE slug = 'studio-discord-community-launch' AND title = 'NNGTW Discord Community Now Open';

UPDATE studio_news_articles
SET
  title = 'Welcome to Nngtw Studio',
  content = E'Nngtw Studio is officially launching its public presence. We\'re a small, focused team creating original games for PC, mobile, and eventually XR platforms.\n\nOur first titles — Arithmetic Destination and King Summon — are actively in development. Follow along as we share our journey.'
WHERE slug = 'welcome-to-nngtw-studio' AND title = 'Welcome to NNGTW Studio';
