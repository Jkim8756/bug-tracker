# Environment

The app runs locally without Supabase credentials by using demo users and local ticket storage.

When the Supabase project is ready, create a local `.env` from `.env.example` and set:

- `VITE_SUPABASE_URL`: Supabase project URL.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: browser-safe Supabase publishable key.

Do not put `service_role`, secret keys, database passwords, or Vercel tokens in tracked files.

## Local Commands

- `npm install`
- `npm run dev`
- `npm test`
- `npm run build`

## Demo Accounts

- `admin@bugtrack.local`: admin role.
- `pm@bugtrack.local`: PM role.
- `engineer@bugtrack.local`: engineer role.

All demo accounts accept any local password because they are local-only placeholders.
