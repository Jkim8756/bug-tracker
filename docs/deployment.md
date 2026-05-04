# Deployment Handoff

Deployment is owned by the DevOps agent.

## Vercel Defaults

- Framework preset: Vite.
- Build command: `npm run build`.
- Output directory: `dist`.
- Install command: `npm install`.

## Required Environment Variables

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Only browser-safe Supabase values belong in Vercel project environment variables for the frontend.

## Supabase Readiness

Before connecting production data:

- Review `supabase/schema.sql`.
- Create a proper migration with the Supabase CLI after requirements are final.
- Enable RLS on exposed tables.
- Verify policies for admin, PM, and engineer roles.
- Confirm email/password auth settings and email confirmation policy.
