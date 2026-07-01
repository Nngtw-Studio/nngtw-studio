/** @format */

// One-off script: copies avatars/, certificates/, profile/ from the public
// nngtw-assets bucket into the private nngtw-assets-private bucket.
// Run AFTER applying supabase/migrations/004_storage_policies.sql.
// Does NOT delete the originals from nngtw-assets — verify the copies in
// nngtw-assets-private first, then remove the source folders manually.
//
// Usage: node --env-file=.env.local scripts/migrate-private-assets.mjs

import { createClient } from '@supabase/supabase-js';

const SOURCE_BUCKET = 'nngtw-assets';
const DEST_BUCKET = 'nngtw-assets-private';
const PRIVATE_FOLDERS = ['avatars', 'certificates', 'profile'];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listAllFiles(folder) {
  const { data, error } = await supabase.storage.from(SOURCE_BUCKET).list(folder, {
    limit: 1000,
  });
  if (error) throw new Error(`list ${folder}: ${error.message}`);
  return (data ?? []).filter((entry) => entry.id !== null).map((entry) => `${folder}/${entry.name}`);
}

async function copyFile(path) {
  const { data, error: downloadError } = await supabase.storage.from(SOURCE_BUCKET).download(path);
  if (downloadError) throw new Error(`download ${path}: ${downloadError.message}`);

  const { error: uploadError } = await supabase.storage
    .from(DEST_BUCKET)
    .upload(path, data, { upsert: true, contentType: data.type });
  if (uploadError) throw new Error(`upload ${path}: ${uploadError.message}`);
}

async function main() {
  for (const folder of PRIVATE_FOLDERS) {
    const files = await listAllFiles(folder);
    console.log(`${folder}/: ${files.length} file(s)`);
    for (const path of files) {
      await copyFile(path);
      console.log(`  copied ${path}`);
    }
  }
  console.log('\nDone. Verify contents in nngtw-assets-private, then remove the');
  console.log('source folders from nngtw-assets manually in the Studio dashboard.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
