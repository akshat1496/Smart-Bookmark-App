This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Problems encountered (backend-focused) and how they were solved

During backend development and integration with Supabase, several backend-specific issues were encountered. Below are the major backend problems, their causes, and the fixes applied. This section intentionally focuses on server/auth/database/runtime issues (UI-related notes were omitted per request).

- Problem: `@supabase/ssr` and client/server imports failing during build or runtime
	- Cause: Mixing client-only and server-only Supabase APIs across server and client components; missing or incorrect package installs and import locations caused module resolution or runtime errors.
	- Fix: Installed the correct Supabase packages (`@supabase/supabase-js` and `@supabase/ssr`) and split initialization: `lib/supabaseClient.ts` (browser/client) and `lib/supabaseServer.ts` (server-side/SSR). Moved server-only logic (service role key, server-side calls) into server components or API routes to avoid leaking secrets client-side.

- Problem: OAuth callback and session finalization (Google sign-in) didn't complete reliably
	- Cause: Missing callback route handling, incorrect redirect URIs in Supabase, and mismatched state parameters caused the app to end up on an incomplete state after provider redirect.
	- Fix: Implemented a server-side callback route at `app/auth/callback/route.ts` to properly handle the provider response and finalize sessions. Ensured redirect URIs configured in Supabase (and in `.env.local`) exactly match the app origins used in development and production, including trailing slashes. Added robust state/return-url handling to resume the user's flow after sign-in.

- Problem: Real-time subscriptions either didn't fire or delivered events for all users
	- Cause: Realtime setup without user scoping and missing Row Level Security (RLS) policies allowed events to be noisy or prevented delivery to authenticated clients.
	- Fix: Scoped real-time subscriptions to per-user channels/filters and enabled appropriate RLS policies on the bookmarks table. Subscriptions in `hooks/useBookmarks.ts` now listen for INSERT/DELETE/UPDATE events filtered by the authenticated user's id. Verified that policies allow the authenticated user to LIST/SELECT their own rows and that the realtime replication is enabled on the table.

- Problem: Database schema drift and migrations management
	- Cause: Manual table edits in Supabase UI and local schema edits diverged, causing inconsistencies between dev and production schemas.
	- Fix: Adopted a migration-first workflow: model schema changes locally (SQL migration files or using Supabase CLI) and apply them through migrations. Kept a minimal schema description in `prisma/` or SQL files if applicable and recorded notable schema changes in repo docs.

- Problem: Secrets and service-role key accidentally used on client or leaked in builds
	- Cause: Server-only keys (service_role) were referenced in code paths that could be bundled client-side, or environment variables were misconfigured in the deployment platform.
	- Fix: Centralized secret usage in server-only modules and API routes, never exposing `SUPABASE_SERVICE_ROLE_KEY` to the browser. Use environment variables in Vercel's dashboard (or your chosen host) and verify the build environment doesn't inject server-only keys into client bundles.

- Problem: Session persistence and token refresh on SSR routes
	- Cause: Server-rendered pages needed to know the current user, but session tokens were stored only client-side; SSR code attempted to read session state incorrectly.
	- Fix: Use server-side Supabase helpers (`@supabase/ssr`) on server components or API routes to retrieve session from cookies during SSR. When needed, exchange refresh tokens server-side and set cookies consistently (`HttpOnly`, correct SameSite, secure in production) so SSR can authenticate requests.

- Problem: Deployment differences (local dev vs Vercel production) — CORS, redirect URIs, and edge/server functions
	- Cause: Local dev uses localhost origins; production uses deployed origin and serverless execution differences (edge vs serverless) affected environment and runtime behavior.
	- Fix: Documented required environment variables and callback URLs, and verified that functions expecting Node APIs run in serverless Node (not edge) if they rely on Node features. Ensure Supabase redirect URIs include both production and preview (Vercel) domains. Test the auth flow in both environments.

- Problem: Performance when querying large bookmark sets (missing indexes, full table scans)
	- Cause: No indexes on common filter columns (for example `user_id` or created_at) caused slow queries as data grew.
	- Fix: Added database indexes on `user_id` and other frequently-filtered columns; used paginated queries (limit/offset or cursor-based) and cached counts where appropriate to avoid expensive full-table count operations on large tables.

- Problem: Realtime permission errors and missing table replication
	- Cause: Realtime not enabled for a table or replication configuration mismatched with RLS policies, causing permission errors when attempting to subscribe.
	- Fix: Enabled realtime replication for the bookmarks table in the Supabase dashboard and adjusted RLS policies so authenticated clients could subscribe to their rows. Verified the Realtime configuration and that the Postgres publication included the table.

If you'd like, I can expand any of the above into concrete code snippets or small migration scripts (for example: RLS policy examples, an SSR auth helper, or the Supabase CLI commands used to create indexes and enable realtime). 


## How to run (development)

1. Copy environment variables (create a `.env.local` in the project root):

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (only for server-side scripts if needed)
NEXTAUTH_URL=http://localhost:3000
```

2. Install and run:

```powershell
npm install
npm run dev
```

Open http://localhost:3000 and sign in with a Google account (if OAuth is configured) to access the dashboard.

## Key files and where to look for fixes

- `app/dashboard/page.tsx` — dashboard layout, the three main cards shown in the UI
- `components/BookmarkForm.tsx` — add bookmark form; styling and input contrast were adjusted here
- `components/BookmarkList.tsx` — empty state and list rendering; improved contrast and empty-state copy
- `components/BookmarkCard.tsx` — individual bookmark UI and metadata (date/URL); date text was darkened
- `hooks/useBookmarks.ts` — central hook for fetching, creating, deleting and subscribing to bookmark changes
- `lib/supabaseClient.ts` and `lib/supabaseServer.ts` — client & server Supabase initialization
- `app/auth/callback/route.ts` — OAuth callback handling for provider redirects

## Troubleshooting

- If icons or gradients don't look right, double-check `tailwind.config.js` for any custom utilities and make sure class names in the components match the config.
- If auth fails, confirm redirect URLs in the Supabase dashboard match your app origin (including trailing slashes) and that `.env.local` values are correct.
- For real-time updates not arriving, check that RLS policies and Supabase Realtime are enabled for the table and that the `onAuthStateChange`/subscription setup uses the authenticated user's id.

If you'd like, I can also add a small CONTRIBUTING or MAINTAINERS section that documents the Tailwind customizations and development checklist.
