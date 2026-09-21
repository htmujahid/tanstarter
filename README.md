# Starter Kit

A batteries-included [TanStack Start](https://tanstack.com/start) admin panel starter kit, deployed to Cloudflare Workers. Authentication, role-based permissions, offline-first data, and a Cloudflare-native REST API come wired up — adapt it for any domain (ecommerce, CRM, property, health, etc.) rather than building the plumbing from scratch.

For the full architecture writeup — server layering, the frontend data-access decision matrix, naming conventions, and the PWA setup — see **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**. This README is the quick-start summary.

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React, [TanStack Router](https://tanstack.com/router) (file-based), [TanStack Query](https://tanstack.com/query), [TanStack DB](https://tanstack.com/db), [TanStack Form](https://tanstack.com/form), [Mantine](https://mantine.dev), Tailwind CSS |
| Server | [TanStack Start](https://tanstack.com/start) (SSR), [Hono](https://hono.dev) + [`@hono/zod-openapi`](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) for the REST API |
| Data | [Drizzle ORM](https://orm.drizzle.team) + Cloudflare D1, [`@tanstack/browser-db-sqlite-persistence`](https://tanstack.com/db) (offline SQLite) + [`@tanstack/offline-transactions`](https://tanstack.com/db) |
| Auth | [better-auth](https://www.better-auth.com) — email/password, passkeys, API keys, role-based permissions, i18n |
| Infra | Cloudflare Workers, D1, Vite, Wrangler |
| i18n | [i18next](https://www.i18next.com) (English + Urdu, RTL-aware) |
| PWA | Installable manifest + service worker (`workbox-build`), offline app shell |

## Quick start

Requires Node.js and [pnpm](https://pnpm.io).

```bash
pnpm install
```

Create `.dev.vars` at the project root with the secrets better-auth needs locally:

```
BETTER_AUTH_SECRET=<any random string>
BETTER_AUTH_URL=http://localhost:3000
```

Apply the database migrations to your local D1 instance:

```bash
pnpm db:migrate:local
```

Start the dev server:

```bash
pnpm dev
```

Open `http://localhost:3000` and go through `/auth/setup` to create the first account — it's automatically granted admin (sign-up is disabled for everyone after that). Alternatively, seed a batch of demo users with `pnpm db:seed` (creates 20 users, 4 of them admins, all with the password `Password123!` — local/demo use only).

## Project structure

```
src/
├── routes/            File-based TanStack Router routes — presentation + wiring only
├── components/        UI + interaction/mutation logic, grouped by area (admin/home/site/...)
├── hooks/             Small, generic, cross-cutting React hooks
├── lib/
│   ├── collections/   TanStack DB collection definitions (one file per domain)
│   ├── queries/       Plain TanStack Query `queryOptions` factories
│   ├── mutations/     Offline-transactions mutation functions
│   ├── db/            Browser persistence + the offline executor
│   └── i18n/          i18next config + en/ur locale resources
└── server/
    ├── services/      Pure Drizzle queries — no auth, no framework
    ├── actions/       TanStack Start server functions, consumed by the frontend
    ├── routes/
    │   ├── platform/  Hono + OpenAPI — 1:1 mirror of actions, for automation/agent consumers
    │   └── v1/        Hono + OpenAPI — public, versioned API for third parties
    ├── auth/          better-auth config, session/permission middleware
    ├── db/            Drizzle schema, migrations, D1 client
    └── openapi/       Shared OpenAPI plumbing (docs UI, request/response models)
```

Every one-file-per-domain layer above is named `<domain>.<category>.ts` (e.g. `notes.service.ts`, `notes.action.ts`, `notes.collection.ts`) — see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#naming-convention) for why.

## API docs

Once the dev server is running, interactive OpenAPI docs are served at:

- `/api/reference` — combined reference (Auth, `v1`, and `platform`)
- `/api/v1/doc`, `/api/platform/doc` — raw OpenAPI JSON per surface

## Available scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Start the Vite dev server (port 3000) |
| `pnpm build` | Production build (also generates the PWA service worker) |
| `pnpm preview` | Preview the production build locally |
| `pnpm deploy` | Build and deploy to Cloudflare Workers |
| `pnpm lint` / `pnpm format` / `pnpm check` | Lint, auto-fix + format, or check formatting |
| `pnpm db:generate` | Generate a new Drizzle migration from schema changes |
| `pnpm db:migrate:local` / `pnpm db:migrate:remote` | Apply migrations to the local or remote D1 database |
| `pnpm db:seed` | Seed demo users (local dev only) |
| `pnpm generate-routes` | Regenerate `src/routeTree.gen.ts` |

## Deploying

This project deploys to Cloudflare Workers via the [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack/) and `wrangler.jsonc` (D1 binding, compatibility flags). To deploy:

```bash
wrangler login
pnpm db:migrate:remote
pnpm deploy
```

Set the same secrets `.dev.vars` holds locally as Worker secrets first:

```bash
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put BETTER_AUTH_URL
```
