import { env } from 'cloudflare:workers'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { createMiddleware } from 'hono/factory'
import { createDb } from '#/server/db'

export function createAuth(bindings: Env) {
  return betterAuth({
    database: drizzleAdapter(createDb(bindings.DB), {
      provider: 'sqlite',
    }),
    secret: bindings.BETTER_AUTH_SECRET,
    baseURL: bindings.BETTER_AUTH_URL,
    emailAndPassword: {
      enabled: true,
    },
  })
}

export function getAuth() {
  return createAuth(env)
}

export type Auth = ReturnType<typeof createAuth>
export type Session = Awaited<ReturnType<Auth['api']['getSession']>>

export type AuthEnv = {
  Bindings: Env
  Variables: {
    session: Session
  }
}

export const requireAuth = createMiddleware<AuthEnv>(async (c, next) => {
  const session = await createAuth(c.env).api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  c.set('session', session)
  await next()
})
