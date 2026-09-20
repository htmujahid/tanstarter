import { Hono } from 'hono'
import { getAuth, requireAuth } from '#/server/auth/auth'
import type { AuthEnv } from '#/server/auth/auth'

/** Mirrors `src/server/actions/session.ts` 1:1. */

const app = new Hono<AuthEnv>()

// getSessionFn — no requireAuth: returns the caller's session, or null if
// unauthenticated, matching the action's own behavior.
app.get('/', async (c) => {
  const session = await getAuth().api.getSession({
    headers: c.req.raw.headers,
  })
  return c.json(session)
})

// listSessionsFn
app.get('/list', requireAuth, async (c) => {
  const sessions = await getAuth().api.listSessions({
    headers: c.req.raw.headers,
  })
  return c.json(sessions)
})

export default app
