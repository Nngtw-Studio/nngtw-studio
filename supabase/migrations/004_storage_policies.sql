-- =============================================================================
-- Migration 004: Scope nngtw-assets public access + split off a private bucket
-- =============================================================================
-- Supabase's security advisor flagged nngtw-assets: a broad SELECT policy on
-- storage.objects let anonymous clients LIST every file in the bucket, not
-- just fetch known logo/icon paths. Since nngtw-assets is a *public* bucket,
-- object GETs bypass RLS entirely — restricting SELECT here only stops
-- enumeration, so avatars/certificates/profile are moved to a private bucket
-- instead of just being policy-restricted in place.
--
-- Public folders staying in nngtw-assets: brands, icons, gallery, projects
-- Private folders moving to nngtw-assets-private: avatars, certificates, profile
--   (file migration handled separately via scripts/migrate-private-assets.mjs,
--   this migration only creates the bucket + policies)
-- =============================================================================

-- Private bucket for content that must never be publicly listable or
-- fetchable via a guessed URL.
INSERT INTO storage.buckets (id, name, public)
VALUES ('nngtw-assets-private', 'nngtw-assets-private', false)
ON CONFLICT (id) DO NOTHING;

-- Remove any existing broad policy on storage.objects referencing
-- nngtw-assets (e.g. the Dashboard's default "public bucket" read policy).
-- Scoped to policies mentioning this bucket so unrelated buckets/policies
-- in this shared project are untouched.
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND qual ILIKE '%nngtw-assets%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- nngtw-assets: public read (list + fetch) restricted to public folders only
CREATE POLICY "nngtw-assets: public read public folders"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'nngtw-assets'
    AND (storage.foldername(name))[1] IN ('brands', 'icons', 'gallery', 'projects')
  );

-- nngtw-assets: authenticated admins can manage all folders (including the
-- private ones during migration/cleanup)
CREATE POLICY "nngtw-assets: admin all"
  ON storage.objects FOR ALL
  USING (bucket_id = 'nngtw-assets' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'nngtw-assets' AND auth.role() = 'authenticated');

-- nngtw-assets-private: authenticated only (admin dashboard reads/writes,
-- server-side signed URLs for anything shown publicly)
CREATE POLICY "nngtw-assets-private: admin all"
  ON storage.objects FOR ALL
  USING (bucket_id = 'nngtw-assets-private' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'nngtw-assets-private' AND auth.role() = 'authenticated');
