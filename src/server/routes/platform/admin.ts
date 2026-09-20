import { createRoute, z } from '@hono/zod-openapi'
import { createMiddleware } from 'hono/factory'
import { getAuth, requireAuth } from '#/server/auth/auth'
import type { AuthEnv } from '#/server/auth/auth'
import { createDb } from '#/server/db'
import { createAuthOpenApiApp } from '#/server/openapi/factory'
import { jsonResponse } from '#/server/openapi/responses'
import {
  AdminStatsSchema,
  BetterAuthPassthroughSchema,
} from '#/server/openapi/models/admin'
import { getUserStats } from '#/server/services/users'

/**
 * Mirrors `src/server/actions/admin.ts` 1:1. better-auth's admin-plugin API
 * methods (`listUsers`/`getUser`/`listUserSessions`) enforce admin-only
 * access internally too, but by *throwing* rather than returning a clean
 * response — left uncaught, that surfaces as a raw 500 instead of a 403.
 * The underlying actions inherit that same rough edge; this route adds an
 * explicit pre-check so platform/agent consumers get a proper status code.
 */

const app = createAuthOpenApiApp()

app.use(requireAuth)
app.use(
  createMiddleware<AuthEnv>(async (c, next) => {
    if (c.var.session!.user.role !== 'admin') {
      return c.json({ error: 'forbidden' }, 403)
    }
    await next()
  }),
)

// All fields stay loose strings, even where the handler only recognizes a
// few values (role, sortDirection) — the handler treats any other value as
// "unset"/falls back silently (never 400s), and a strict z.enum() here
// would reject those values instead of preserving that exact behavior.
const listUsersQuery = z.object({
  searchValue: z.string().optional(),
  role: z.string().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
  sortBy: z.string().optional(),
  sortDirection: z.string().optional(),
})

const userIdParam = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
})

// listUsersFn
app.openapi(
  createRoute({
    method: 'get',
    path: '/users',
    tags: ['Admin'],
    request: { query: listUsersQuery },
    responses: {
      200: jsonResponse(BetterAuthPassthroughSchema, 'Paginated list of users'),
    },
  }),
  async (c) => {
    const q = c.req.query()
    const searchValue = q.searchValue || undefined
    const role = q.role === 'admin' || q.role === 'user' ? q.role : undefined

    const result = await getAuth().api.listUsers({
      query: {
        searchValue,
        searchField: searchValue?.includes('@') ? 'email' : 'name',
        searchOperator: 'contains',
        filterField: role ? 'role' : undefined,
        filterValue: role,
        filterOperator: role ? 'eq' : undefined,
        limit: Number(q.limit ?? 20),
        offset: Number(q.offset ?? 0),
        sortBy: q.sortBy ?? 'createdAt',
        sortDirection: q.sortDirection === 'asc' ? 'asc' : 'desc',
      },
      headers: c.req.raw.headers,
    })

    return c.json(result, 200)
  },
)

// getUserFn
app.openapi(
  createRoute({
    method: 'get',
    path: '/users/{id}',
    tags: ['Admin'],
    request: { params: userIdParam },
    responses: {
      200: jsonResponse(BetterAuthPassthroughSchema, 'A single user'),
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param')
    const user = await getAuth().api.getUser({
      query: { id },
      headers: c.req.raw.headers,
    })
    return c.json(user, 200)
  },
)

// listUserSessionsFn
app.openapi(
  createRoute({
    method: 'get',
    path: '/users/{id}/sessions',
    tags: ['Admin'],
    request: { params: userIdParam },
    responses: {
      200: jsonResponse(BetterAuthPassthroughSchema, "A user's sessions"),
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param')
    const sessions = await getAuth().api.listUserSessions({
      body: { userId: id },
      headers: c.req.raw.headers,
    })
    return c.json(sessions, 200)
  },
)

// getAdminStatsFn
app.openapi(
  createRoute({
    method: 'get',
    path: '/stats',
    tags: ['Admin'],
    responses: { 200: jsonResponse(AdminStatsSchema, 'User statistics') },
  }),
  async (c) => {
    const db = createDb(c.env.DB)
    const stats = await getUserStats(db)
    return c.json(stats, 200)
  },
)

export default app
