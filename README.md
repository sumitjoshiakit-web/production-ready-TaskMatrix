# TaskMatrix — Production & Submission Build

TaskMatrix is a collaborative project and task management workspace built with Next.js, TypeScript, Supabase Auth/Postgres, and Recharts. It combines project organisation, team assignment, a five-stage Kanban workflow, task discussion, activity history, and progress analytics.

## Features
- Supabase email/password authentication and session-aware route protection.
- Project creation and team-member email management.
- Task CRUD with description, status, priority, due date, project, and assignee.
- Five-stage Kanban: Backlog, To do, In progress, Review, Done.
- Drag-and-drop and arrow controls for moving tasks.
- Task comments and activity history.
- Search, status filtering, metrics, and completion analytics.
- Responsive dashboard with horizontal Kanban scrolling on small screens.
- Route-level/global error fallback screens.
- GitHub Actions checks for lint, TypeScript, and production build.

## Stack
Next.js 14 App Router · React 18 · TypeScript · Supabase Auth/Postgres/RLS · Zustand · Recharts.

## Local setup
1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and set the Supabase project URL and anon/publishable key.
4. Back up the existing Supabase project first. Review the migration, then run `supabase/schema.sql` in the Supabase SQL Editor. The migration no longer clears legacy `project_id` values; its project foreign key is added `NOT VALID` so existing rows are preserved while new writes are checked.
5. Configure Supabase Auth Site URL and allowed redirect URLs for localhost and the production domain.
6. Run `npm run dev` and open http://localhost:3000.

## Environment variables
| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/publishable key |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL used for metadata |
| `GEMINI_API_KEY` | Optional for AI summary | Server-only Gemini API key; never expose with a NEXT_PUBLIC_ prefix |
| `GEMINI_MODEL` | No | Optional Gemini model override (defaults to gemini-2.5-flash) |

Never expose the Supabase `service_role` key in browser code, public environment variables, screenshots, or commits.

## Validation
```bash
npm run lint
npm run typecheck
npm run build
```
GitHub Actions runs these checks on pushes and pull requests. A successful build does not prove that production Supabase credentials, RLS, email confirmation, or Vercel settings are correct.

## Supabase security verification
Run the supplied SQL in the intended Supabase project only after taking a backup. The migration replaces only the TaskMatrix policies/triggers it explicitly names; it does not drop application tables or delete existing task rows. The project foreign key is added as `NOT VALID` to avoid rewriting legacy rows. Before validating it, inspect any legacy references with:

```sql
select t.id, t.project_id
from public.tasks t
left join public.projects p on p.id = t.project_id
where t.project_id is not null and p.id is null;
```

If this returns no rows, you may validate the constraint with `alter table public.tasks validate constraint tasks_project_id_fkey;`. If it returns rows, investigate and repair those references manually; do not clear them automatically. Test with two separate accounts:
- User A can manage their own projects and tasks.
- User B cannot read or modify User A's private records unless an explicit assignee policy grants access to that task.
- Project membership alone does not grant blanket task access.
- Comments and activity records obey task-level access policies.
- Signed-out users cannot access `/dashboard`.
- Refreshing a signed-in session preserves authentication and saved records.

Do not mark these checks complete until they are tested against the actual Supabase project.

## AI dashboard summary
The dashboard includes an optional AI summary powered by a server-side Next.js route. Add `GEMINI_API_KEY` to Vercel Production/Preview/Development environment variables to enable it. The browser sends the signed-in Supabase access token and a bounded dashboard snapshot; the server verifies the user with Supabase before forwarding the summary request to Gemini. The provider key is never sent to the browser. If the key is absent or the provider is unavailable, the dashboard remains usable and shows a recoverable fallback message.

## Vercel deployment
1. Import this repository into Vercel and select the Next.js preset.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Production, Preview, and Development as needed. Add `NEXT_PUBLIC_SITE_URL` for the production canonical URL (and use the matching deployment URL for Preview if you need preview metadata).
3. Set `NEXT_PUBLIC_SITE_URL` to the exact deployed URL.
4. Deploy and inspect the build logs.
5. Add the exact Vercel URL to Supabase Auth Site URL and redirect allow-list.
6. Test registration, email confirmation, login/logout, protected routes, CRUD, assignment, comments, and analytics on the live site.
7. Add the verified deployment URL below.

**Production URL:** _Add after deployment is verified._

## Submission checklist
- [ ] Supabase environment variables configured in Vercel.
- [ ] Current SQL schema applied to the target Supabase project.
- [ ] Owner/assignee access verified with two test accounts.
- [ ] Authentication and protected routes tested in production.
- [ ] Project/task CRUD, drag-and-drop, comments, and analytics tested.
- [ ] Mobile layout tested at narrow viewport widths.
- [ ] GitHub Actions green on the final commit.
- [ ] Vercel production deployment and SSL verified.
- [ ] Production URL added above.
- [ ] Reviewer-accessible Figma link and final screenshots added if required.

## Project history
This repository continues the TaskMatrix Sprint 15 implementation and preserves its Next.js + Supabase architecture and product features.
- [Sprint 13 planning](https://github.com/sumitjoshiakit-web/prodesk-capstone-TaskMatrix1)
- [Sprint 14 authentication foundation](https://github.com/sumitjoshiakit-web/prodesk-capstone--TaskMatrix-2)
- [Sprint 15 implementation source](https://github.com/sumitjoshiakit-web/prodesk-capstone-TaskMatrix3)
