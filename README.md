# Examio

Examio is a student-focused digital examination platform for Swedish Year 8 physics. This package keeps the existing public design and exam UI, and adds a Vercel-compatible serverless Admin backend.

## Requirements

- Node.js 20+
- A hosted PostgreSQL database such as Neon, Supabase, or Vercel Postgres
- A Vercel account and a private GitHub repository
- Vercel CLI for local testing (`npm install -g vercel`)

## Local setup

```bash
npm install
cp .env.example .env
# Fill DATABASE_URL, SESSION_SECRET and CRON_SECRET locally.
npm run migrate
npm run create-admin
npm start
```

`npm run generate-password` prints a strong password to the terminal only. Admin passwords are never written to the repository. `npm run create-admin` asks for a display name, title, and a password; blank password input generates one and displays it once.

## Vercel deployment

1. Create a hosted Postgres database and copy its connection string.
2. Push this project to a private GitHub repository.
3. Import that repository into Vercel.
4. Set these Vercel environment variables for Production, Preview, and Development as appropriate:
   - `DATABASE_URL`
   - `SESSION_SECRET` — a long random value
   - `CRON_SECRET` — a separate long random value
   - `SETUP_TOKEN` — reserved for future protected setup operations
   - `GROQ_API_KEY` — optional, server-side only
5. Run `npm run migrate` once with `DATABASE_URL` pointed at the production database.
6. Run `npm run create-admin` once or as often as needed against that database.
7. Deploy by connecting the GitHub repository or running `vercel --prod`.

The scheduled Vercel Cron route `/api/cron/cleanup` removes IP logs older than 30 days and expired sessions. It requires `Authorization: Bearer $CRON_SECRET`.

## Security

- Do not commit `.env` or any password.
- Keep the repository private when possible.
- Rotate credentials immediately if they leak.
- Admin passwords are stored as bcrypt hashes in Postgres.
- Sessions, login attempts, IP logs, blocked IPs, exams, questions, and keys are stored in Postgres rather than local files.

## Project structure

- `public/` — existing Examio landing page, assets, and Admin UI
- `api/` — Vercel serverless endpoints
- `lib/` — database and security helpers
- `db/schema.sql` — Postgres schema and initial public exam key
- `scripts/` — migration, admin creation, and password generation
- `vercel.json` — Vercel routes and Cron schedule
