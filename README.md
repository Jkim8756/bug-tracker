# BugTrack

Local-first bug tracker built with Vue, Vite, Supabase, PostgreSQL, and Vercel deployment readiness.

## Features

- Email/password authentication UI with local demo fallback.
- Role-aware behavior for admin, PM, and engineer users.
- Ticket queue with search, filters, assignment, edit drawer, and delete permissions.
- JSON and CSV ticket export.
- Dashboard visuals for ticket totals, status, priority, workload, and activity.
- Draft Supabase/PostgreSQL schema with RLS policies.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

## Checks

```bash
npm test
npm run build
```

## Supabase

Local demo mode works without credentials. To connect Supabase, copy `.env.example` to `.env` and set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Review `supabase/schema.sql` before applying it to a real project.
