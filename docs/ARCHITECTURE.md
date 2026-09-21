# Architecture

How this codebase is layered, and — the part that's easy to get wrong — **which
data-access pattern to reach for** when adding a new domain. Everything below
reflects the current code (`notes`, `announcements`, `contact`, `feedback`,
`admin` users, `api-key`), not aspirational structure.

## Runtime entry

`src/server.ts` is the actual Cloudflare Workers entrypoint. It's a Hono app,
not a TanStack Start server-route setup:

```ts
const app = new Hono<{ Bindings: Env }>()
app.use('*', languageDetector({ ... }))   // locale cookie/header -> c.get('language')
app.route('/api', api)                    // src/server/routes
app.all('/api/*', (c) => c.notFound())
app.all('*', (c) => startHandler(c.req.raw)) // everything else -> TanStack Start SSR
```

Hono owns `/api/*`. Every other path falls through to TanStack Start's own
request handler (`createStartHandler`), which serves the file-based routes in
`src/routes/`. **TanStack Start's `server: { handlers }` route-file feature is
intentionally unused** — API surface is Hono, always, so there's one router,
one auth story, and one OpenAPI doc instead of two.

## Server-side layering

Four layers, each with a narrow job. New domains add one file per layer.

```
server/services/<domain>.ts        pure drizzle queries, no auth, no framework
server/actions/<domain>.ts         createServerFn — used by src/routes/** (frontend)
server/routes/platform/<domain>.ts Hono+OpenAPI — 1:1 REST mirror of actions, for automation
server/routes/v1/<domain>.ts       Hono+OpenAPI — public/versioned storefront API
```

### `server/services/*`

Plain functions taking a `Database` (drizzle) plus plain args, returning plain
data. No `createServerFn`, no Hono, no auth check — just query logic
(`server/services/notes.ts`: `listNotes`, `getNoteById`, `createNote`,
`updateNote`, `deleteNote`). Both the `actions` layer and the `routes/platform`
layer call straight into these, so business logic and SQL live in exactly one
place per domain.

### `server/actions/*`

`createServerFn` calls consumed by the React frontend (`src/routes/**`,
`src/lib/collections/**`, `src/lib/queries/**`). Pattern, every time
(`server/actions/notes.ts`):

```ts
export const createNoteFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: CreateNoteInput) => { /* throw on bad input */ return data })
  .handler(async ({ data, context }) => {
    await requirePermission(context.user.role, { notes: ['create'] })
    return createNote(getDb(), context.user.id, data)
  })
```

- `authMiddleware` (`server/auth/middleware.ts`) resolves the better-auth
  session from the request and puts `context.user` on the handler context, or
  throws if there's no session.
- `requirePermission(role, checks)` (`server/auth/require-permission.ts`) is a
  **plain function called inside the handler body**, not a middleware — it has
  to be, because TanStack Start tree-shakes `.handler()` bodies out of the
  client bundle but can't statically split a middleware object built by a
  factory called inside `.middleware([...])`. Making it a middleware pulled
  `auth.ts` (and `cloudflare:workers`) into the client bundle. Always call it
  this way for new actions, not as a middleware.
- Public/unauthenticated actions (e.g. `listPublicAnnouncementsFn`,
  `getPublicAnnouncementFn` used by `src/routes/site/**`) simply omit the auth
  middleware and permission check.

### `server/routes/platform/*`

Hono + `@hono/zod-openapi`, mounted at `/api/platform`. Doc comment in
`server/routes/platform/index.ts` says it best:

> Internal automation API — a 1:1 REST mirror of every `createServerFn` in
> `src/server/actions/`. Meant for programmatic/agent consumers acting on
> behalf of a signed-in user (session cookie or API key — both work here since
> `requireAuth` resolves either transparently), not for the storefront.

Concretely, for every domain that has actions meant to be automatable
(`notes`, `contact`, `feedback`, `announcements`, `setup`), there's a
`server/routes/platform/<domain>.ts` with the same operations, same
permission checks, same underlying `server/services/<domain>.ts` calls —
just exposed as REST + OpenAPI instead of as RPC-style server functions. This
is what a future agent/MCP integration is meant to call. Pure passthroughs to
better-auth's own API (session/passkey/api-key/admin/user management) are
**not** mirrored here — they're already reachable at `/api/auth` via the
`openAPI()` better-auth plugin, so mirroring them would just be an extra hop.

Each route file:

```ts
const app = createAuthOpenApiApp()      // OpenAPIHono<AuthEnv>, zod validation errors -> 400
app.use(requireAuth)                    // session OR api key, both populate c.var.session
app.openapi(createRoute({ ..., middleware: [requirePermissionRoute({ notes: ['read'] })] }), handler)
```

`requireAuth` (`server/auth/auth.ts`) calls `getAuth().api.getSession(...)`.
Because the `apiKey` plugin is registered with `enableSessionForAPIKeys:
true`, a request authenticated with an API key resolves to a session here
just like a cookie would — `requireAuth` doesn't need to special-case it.
`requirePermissionRoute` (`server/auth/require-permission.ts`) is the
route-middleware twin of `requirePermission` — safe to build via a factory
here because `server/routes/*` is server-only and never touches the client
bundle.

### `server/routes/v1/*`

Hono + OpenAPI, mounted at `/api/v1`. Doc comment in
`server/routes/v1/index.ts`:

> Public storefront-facing REST API. Stable, versioned contract mirroring
> `src/routes/site/` (contact, announcements, feedback) for any external
> consumer (a storefront frontend, third-party integration, etc).

This is the one meant for **third parties using an API key** (the
`apiKey`/`@better-auth/api-key` plugin), separate from `platform`'s
"automation acting as the signed-in user" purpose. Endpoints here mirror
whatever's public in `src/routes/site/**` — e.g.
`server/routes/v1/announcements.ts` only exposes published announcements and
sets `security: []` on the OpenAPI route since no auth is required for those
GETs. `contact` and `feedback` under `v1` are the public *submission*
endpoints (anyone can submit a contact message or feedback), not the admin
read/manage side — that admin side only exists as actions +
`server/routes/platform` (auth'd, permission-checked), never in `v1`.

**Adding a new domain**: if it has an admin-manageable + storefront-visible
shape like announcements, you'll likely want actions (frontend), a
`platform` mirror (automation), and a `v1` public slice (storefront/3rd
party) — but only build the `v1` slice if the data is actually meant to be
public/external. Purely internal domains (e.g. `notes`, which is per-user
private data) only need actions + `platform`, no `v1`.

### OpenAPI plumbing

`server/openapi/factory.ts` — `createAuthOpenApiApp()` /
`createPublicOpenApiApp()` wrap `OpenAPIHono` with a shared `defaultHook`
that turns any zod validation failure into `{ error: 'invalid request' }`
(400), without overriding hand-written business-rule error responses already
in a handler body (e.g. `'title is required'`). `server/openapi/models/*.ts`
holds the zod request/response schemas per domain.
`server/openapi/params.ts`/`responses.ts` are the shared `idParam` param
schema and `jsonResponse`/`errorResponse` helpers used across every route
file. `server/openapi/mount.ts` registers the security scheme and mounts
`/doc` + Scalar reference UI per sub-app (`platform` and `v1` each get their
own doc, see `/api/platform/reference` style routes wired in
`server/routes/index.ts`).

### Auth & permissions model

- `server/auth/auth.ts` — `createAuth(bindings)` builds the better-auth
  instance (Drizzle/D1 adapter, plugins: `username`, `admin` (with the
  `ac`/roles from `server/auth/permissions.ts`), `passkey`, `apiKey`,
  `openAPI`, `i18n`). `getAuth()` is the Workers-context-bound convenience
  wrapper. `requireAuth` is the Hono middleware used by `routes/platform` and
  `routes/v1` (where auth is required); it 401s if there's no session.
- `server/auth/middleware.ts` — `authMiddleware`, the TanStack Start
  `createServerFn` middleware equivalent, used by `server/actions/*`.
- `server/auth/require-permission.ts` — `requirePermission` (call inside a
  server-fn handler body) and `requirePermissionRoute` (Hono middleware
  factory, use in `.middleware: [...]` on an `openapi()` route). Both delegate
  to better-auth's own `api.userHasPermission` against the roles defined in
  `server/auth/permissions.ts`, so the access-control rules live in exactly
  one place.

## Frontend layering

```
src/routes/**        file-based TanStack Router routes — presentation + wiring only
src/components/**    the actual UI + interaction/mutation logic, grouped by area
src/hooks/**         small cross-cutting React hooks
src/lib/**           framework-agnostic frontend logic: collections, queries, mutations, db
```

### `routes/`

Mirrors the site's information architecture: `home/**` (signed-in user
area), `admin/**` (admin area), `site/**` (public storefront), `auth/**`.
A route file's job is `validateSearch`, `loader` (usually just
`collection.preload()` or nothing — data reads happen via `useLiveQuery`/
`useQuery` in the component), `staticData.breadcrumb`, and rendering a
component from `src/components/**` wired up with whatever URL-derived props
it needs (search params, route params, navigate callbacks). See
`routes/home/notes/index.tsx`: the route owns the search-param shape and the
loader's `preload()`, and passes `q`/`sortBy`/`page`/`onXChange` down to
`<NotesTable>` — it does not itself run `useLiveQuery` or own mutation state.

Keep it this way for new routes: **no `useState` for domain data, no direct
collection/query calls, no mutation calls in a route file.** The one
exception is layout-level chrome state that has nothing to do with domain
data — `routes/home/route.tsx` and `routes/admin/route.tsx` hold
`useDisclosure`/`useLocalStorage` for the sidebar's collapsed/mobile state,
because that's shell presentation, not application state. Everything
data-shaped belongs in `components/`.

### `components/`

Grouped by area exactly like `routes/`: `admin/<domain>/`, `home/<domain>/`,
`site/<domain>/`, plus cross-cutting groups: `dashboard/` (shared shell parts
used by both `home` and `admin` layouts — header, sidebar chrome, stat cards,
the offline badge), `layout/` (generic, domain-free shells:
`DetailPageLayout`, `RouteError`, `SectionNotFound`), `auth/`, `profile/`,
and a few app-wide singles at the top level (`header.tsx`, `theme-toggle.tsx`,
`locale-toggle.tsx`). This is where `useForm`, `useLiveQuery`,
`useOfflineExecutor`, table state, and modal open/close state actually live
(see `components/home/notes/*`, `components/admin/announcements/*`).

### `hooks/`

Small, generic, reusable React hooks with no UI: `use-session.ts` (pulls
`session` off the root route context), `use-locale.ts`. Add here anything
that's cross-cutting glue rather than a `lib/` data primitive or a
domain-specific piece of UI state.

### `lib/`

Framework-agnostic frontend logic, split by what kind of thing it is:

- `lib/collections/<domain>.ts` — TanStack DB collection definitions (one
  file per collection, mirroring `lib/queries/`'s one-file-per-domain
  layout — see the memory note on this convention).
- `lib/queries/<domain>.ts` — plain TanStack Query `queryOptions` factories.
- `lib/mutations/<domain>.ts` — `OfflineConfig['mutationFns']` for domains
  wired through `@tanstack/offline-transactions` (currently just `notes`).
- `lib/db/` — the app's own DB client plumbing: `client-persistence.ts`
  (the browser OPFS/SQLite persistence backing `persistedCollectionOptions`,
  browser-only, no-ops on the server) and `offline-executor.ts` (the
  singleton `OfflineExecutor` from `@tanstack/offline-transactions`, plus
  `useOfflineExecutor()`).
- `lib/i18n/`, `lib/auth-client.ts`, `lib/features.ts`, `lib/format-date.ts`,
  `lib/dashboard-data.ts` — other frontend-only concerns, not part of the
  data-access decision below.

## Data-access decision matrix

This is the crux of "which TanStack tool for this domain." Four patterns
exist in the codebase today; pick based on two questions: **does the list
need server-side pagination**, and **does it need to work offline / survive
a refresh with local durability**?

| Pattern | Use when | Example domains | Where |
|---|---|---|---|
| Plain TanStack Query `queryOptions` | List needs server-side pagination/sort/search, or the data changes too often / is too large to hold client-side as a full synced set | `contact`, `feedback`, `admin` users | `lib/queries/contact.ts`, `lib/queries/admin.ts` — `queryOptions({ queryKey: [...], queryFn: () => listXFn({ data: { limit, offset, ... } }) })`, mutations call `createServerFn`s directly from the component (no collection) |
| TanStack DB query collection (`collectionOptions` + `queryCollectionOptions`) | Whole table fits comfortably client-side (no server pagination needed), and it doesn't change often/fast enough to need offline durability — just needs live, reactive, optimistic CRUD in memory | `announcements` | `lib/collections/announcements.ts` — `queryFn` loads everything up to a generous cap (`ANNOUNCEMENTS_COLLECTION_LIMIT = 1000`), `onInsert`/`onUpdate`/`onDelete` call the server actions directly and inline (no offline queue — if the request fails, the mutation just fails) |
| TanStack DB query collection + browser persistence + offline-transactions | Same "fits client-side, no server pagination" shape as above, but the data needs to survive being offline (create/update/delete while disconnected, sync later) | `notes` | `lib/collections/notes.ts` wraps the same `queryCollectionOptions` in `persistedCollectionOptions({ persistence, schemaVersion })` (this app's own `client-persistence.ts`, OPFS/SQLite-backed) for durability; `lib/mutations/notes.ts` + `lib/db/offline-executor.ts` provide the `OfflineConfig['mutationFns']` an `OfflineExecutor` drains once back online. Components use `executor.createOfflineTransaction({ mutationFnName }).mutate(() => collection.insert/update/delete(...))` instead of calling the collection directly, and must not assume `tx.isPersisted.promise` settles promptly while offline — see `lib/db/offline-executor.ts`'s `waitForTransaction` helper |
| `localStorageCollectionOptions` | Purely client-side state that never touches the server — form drafts, no sync, no server round-trip at all | `contact` and `feedback` form drafts | `lib/collections/contact-draft.ts`, `lib/collections/feedback-draft.ts` |

Rule of thumb when adding a new domain:

1. Does the UI ever need "page 3 of 500 rows, sorted by X, filtered by Y" at
   the server? → **plain `queryOptions`**, paginated server-side, no
   collection.
2. Otherwise, is it OK if a create/update/delete just fails outright when
   offline (nothing durable needs to survive disconnect)? → **query
   collection**, no persistence, no offline-transactions — mutate via
   `onInsert`/`onUpdate`/`onDelete` directly.
3. Otherwise (mutations must survive being offline and sync later)? → **query
   collection + `persistedCollectionOptions` + offline-transactions**, mutate
   via `executor.createOfflineTransaction(...).mutate(...)`.
4. Is the data never meant to reach the server at all (a scratch draft)? →
   **`localStorageCollectionOptions`**.

