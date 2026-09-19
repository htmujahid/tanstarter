import { Hono } from 'hono'
import { createAuth } from '#/server/auth/auth'

const auth = new Hono<{ Bindings: Env }>()

auth.on(['GET', 'POST'], '/*', (c) => createAuth(c.env).handler(c.req.raw))

export default auth
