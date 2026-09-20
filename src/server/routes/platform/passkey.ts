import { Hono } from 'hono'
import { getAuth, requireAuth } from '#/server/auth/auth'
import type { AuthEnv } from '#/server/auth/auth'

/** Mirrors `src/server/actions/passkey.ts` 1:1. */

const app = new Hono<AuthEnv>()

app.use(requireAuth)

app.get('/', async (c) => {
  const passkeys = await getAuth().api.listPasskeys({
    headers: c.req.raw.headers,
  })
  return c.json(passkeys)
})

export default app
