import { Hono } from 'hono'
import { createDb } from '#/server/db'
import { hasAnyUser } from '#/server/services/users'

/** Mirrors `src/server/actions/setup.ts` 1:1. Public — used to decide
 * whether sign-up should be offered at all. */

const app = new Hono<{ Bindings: Env }>()

app.get('/', async (c) => {
  const db = createDb(c.env.DB)
  const needsSetup = !(await hasAnyUser(db))
  return c.json({ needsSetup })
})

export default app
