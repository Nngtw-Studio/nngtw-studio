import { createClient } from "@supabase/supabase-js";

/**
 * Anonymous read-only client for public data queries.
 *
 * Use this everywhere in the query layer:
 *   - generateStaticParams (build time — no request context)
 *   - Server Components fetching public content
 *   - Any query that doesn't need the signed-in user's session
 *
 * Do NOT use this for admin operations. Use @/lib/supabase/server for
 * anything that requires the authenticated user's cookie session.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );
}
