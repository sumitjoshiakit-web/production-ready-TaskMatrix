# TaskMatrix

TaskMatrix is a collaborative project and task management workspace built with Next.js, TypeScript, Supabase Auth/Postgres, Zustand, and Recharts. It brings project organisation, team assignment, a five-stage Kanban workflow, task discussion, activity history, and progress analytics into one responsive dashboard.

## Core features

- Email/password authentication, email-based password recovery, and protected dashboard routes.
- Project creation, project member management, and task assignment by email.
- Task create, read, update, and delete with status, priority, due date, project, and assignee.
- Five-stage Kanban workflow: Backlog, To do, In progress, Review, and Done.
- Drag-and-drop task movement plus keyboard/tap-friendly arrow controls.
- Task comments and activity history.
- Search, status filters, workspace metrics, and completion analytics.
- AI-generated project insights through a server-side Gemini API route.
- Responsive layout, accessible loading/error feedback, and stacked notifications.
- GitHub Actions validation for lint, TypeScript, and production build.

## Technology

Next.js 14 App Router · React 18 · TypeScript · Supabase Auth/Postgres/RLS · Zustand · Recharts · Gemini API.

## Local development

**Requirements:** Node.js 20 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

Set the following values in `.env.local`:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/publishable key |
| `NEXT_PUBLIC_SITE_URL` | Recommended in production | Canonical site URL used for metadata |
| `GEMINI_API_KEY` | Required for AI insights | Server-only Gemini API key |
| `GEMINI_MODEL` | No | Gemini model override; defaults to `gemini-2.5-flash` |

Never add a `service_role` key to browser code, a `NEXT_PUBLIC_*` variable, screenshots, or source control. Never expose `GEMINI_API_KEY` to the browser.

## Supabase configuration

1. Create or select a Supabase project.
2. Review `supabase/schema.sql` and back up existing data before applying schema changes in the Supabase SQL Editor.
3. In **Authentication → URL Configuration**, set the Site URL to the deployed app origin.
4. Add the exact deployed `/login` callback URL to the Redirect URLs allow-list. For local development, also allow `http://localhost:3000/login`.
5. Test with two separate accounts to confirm that row-level security (RLS) prevents one user from reading or modifying another user's private projects and tasks.

The schema migration is designed to preserve existing task rows and legacy `project_id` values. The project foreign key is added as `NOT VALID` so existing rows can be inspected before constraint validation. Before validating it, check for orphaned project references:

```sql
select t.id, t.project_id
from public.tasks t
left join public.projects p on p.id = t.project_id
where t.project_id is not null and p.id is null;
```

Resolve any returned rows deliberately; do not clear legacy references automatically. Project membership does not grant blanket access to every task. Comments and activity records must follow task-level policies.

## AI project insights

The dashboard sends a bounded task/project snapshot and the signed-in Supabase access token to `/api/ai/summary`. The server verifies the token with Supabase before calling Gemini. The Gemini key remains server-side.

Set `GEMINI_API_KEY` in the Vercel environment for every deployment environment that should offer AI insights. If the key is not configured or Gemini is unavailable, the rest of the workspace remains usable and the AI panel shows a retryable message.

The route limits snapshot item counts and text lengths. It does not currently use a shared distributed per-user rate limiter; configure provider-side quotas and monitor Gemini usage for production.

## Validation

Run the same checks used by GitHub Actions:

```bash
npm run lint
npm run typecheck
npm run build
```

The CI workflow runs these checks on pushes and pull requests. Build-time Supabase values in CI are placeholders used only to compile the app; they do not validate live authentication, database policies, or production environment configuration.

## Vercel deployment

1. Import this GitHub repository into Vercel and use the Next.js preset.
2. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL` to the appropriate Vercel environments. Set `NEXT_PUBLIC_SITE_URL` to the exact production origin shown in your Vercel project settings.
3. Add `GEMINI_API_KEY` as a server-side environment variable to enable AI insights. `GEMINI_MODEL` is optional.
4. Deploy the application.
5. Add the deployed `/login` callback URL to the Supabase Auth Redirect URLs allow-list and set the Supabase Site URL to the production origin.
6. Verify registration/email confirmation, login/logout, protected routes, project/task CRUD, Kanban movement, comments, analytics, and the AI summary on the deployed site.

## Project history

This repository continues the TaskMatrix Sprint 15 implementation and preserves its Next.js + Supabase architecture.

- [Sprint 13 planning](https://github.com/sumitjoshiakit-web/prodesk-capstone-TaskMatrix1)
- [Sprint 14 authentication foundation](https://github.com/sumitjoshiakit-web/prodesk-capstone--TaskMatrix-2)
- [Sprint 15 implementation source](https://github.com/sumitjoshiakit-web/prodesk-capstone-TaskMatrix3)
