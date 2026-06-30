# NNGTW Studio Website

Official website for **NNGTW Studio** — an independent game development studio creating original games for PC, Mobile, XR and Virtual Reality.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** + **GSAP**
- **Supabase** (Auth, Database, Storage)
- **Vercel** ready

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

The site works without Supabase configured — content is served from static data in `src/lib/data/content.ts`. Connect Supabase to enable the admin panel and dynamic content.

## Supabase Setup

1. Create a Supabase project
2. Run the migration in `supabase/migrations/001_initial_schema.sql`
3. Create a storage bucket named `media`
4. Create an admin user via Supabase Auth
5. Add credentials to `.env.local`

## Admin Panel

Access at `/admin/login`. Requires Supabase authentication.

## Deployment

Deploy to Vercel with `npm run build`. Set environment variables in the Vercel dashboard.
