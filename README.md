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
4. Run the complete `supabase/schema.sql` in the Supabase SQL Editor.
5. Configure Supabase Auth Site URL and allowed redirect URLs for localhost and the production domain.
6. Run `npm run dev` and open http://localhost:3000.

## Environment variables
| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/publishable key |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL used for metadata |

Never expose the Supabase `service_role` key in browser code, public environment variables, screenshots, or commits.

## Validation
```bash
npm run lint
npm run typecheck
npm run build
```
GitHub Actions runs these checks on pushes and pull requests. A successful build does not prove that production Supabase credentials, RLS, email confirmation, or Vercel settings are correct.

## Supabase security verification
Run the supplied SQL in the intended Supabase project. Test with two separate accounts:
- User A can manage their own projects and tasks.
- User B cannot read or modify User A's private records unless an explicit assignee policy grants access to that task.
- Project membership alone does not grant blanket task access.
- Comments and activity records obey task-level access policies.
- Signed-out users cannot access `/dashboard`.
- Refreshing a signed-in session preserves authentication and saved records.

Do not mark these checks complete until they are tested against the actual Supabase project.

## Vercel deployment
1. Import this repository into Vercel and select the Next.js preset.
2. Add the environment variables above to the Production and Preview environments.
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
