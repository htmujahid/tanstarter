import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { getAuth, requireAuth } from '#/server/auth/auth'
import type { AuthEnv } from '#/server/auth/auth'
import { createDb } from '#/server/db'
import { getUserStats } from '#/server/services/users'

/**
 * Mirrors `src/server/actions/admin.ts` 1:1. better-auth's admin-plugin API
 * methods (`listUsers`/`getUser`/`listUserSessions`) enforce admin-only
 * access internally too, but by *throwing* rather than returning a clean
 * response — left uncaught, that surfaces as a raw 500 instead of a 403.
 * The underlying actions inherit that same rough edge; this route adds an
 * explicit pre-check so platform/agent consumers get a proper status code.
 */

const app = new Hono<AuthEnv>()

app.use(requireAuth)
app.use(
  createMiddleware<AuthEnv>(async (c, next) => {
    if (c.var.session!.user.role !== 'admin') {
      return c.json({ error: 'forbidden' }, 403)
    }
    await next()
  }),
)

// listUsersFn
app.get('/users', async (c) => {
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

  return c.json(result)
})

// getUserFn
app.get('/users/:id', async (c) => {
  const user = await getAuth().api.getUser({
    query: { id: c.req.param('id') },
    headers: c.req.raw.headers,
  })
  return c.json(user)
})

// listUserSessionsFn
app.get('/users/:id/sessions', async (c) => {
  const sessions = await getAuth().api.listUserSessions({
    body: { userId: c.req.param('id') },
    headers: c.req.raw.headers,
  })
  return c.json(sessions)
})

// getAdminStatsFn
app.get('/stats', async (c) => {
  const db = createDb(c.env.DB)
  const stats = await getUserStats(db)
  return c.json(stats)
})

export default app
