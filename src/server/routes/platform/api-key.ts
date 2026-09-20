import { Hono } from 'hono'
import { getAuth, requireAuth } from '#/server/auth/auth'
import type { AuthEnv } from '#/server/auth/auth'

/** Mirrors `src/server/actions/api-key.ts` 1:1. */

const app = new Hono<AuthEnv>()

app.use(requireAuth)

app.get('/', async (c) => {
  const { apiKeys } = await getAuth().api.listApiKeys({
    headers: c.req.raw.headers,
  })
  return c.json(apiKeys)
})

export default app
