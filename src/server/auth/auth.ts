import { env } from 'cloudflare:workers'
import { APIError, betterAuth } from 'better-auth'
import { createAuthMiddleware } from 'better-auth/api'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { username } from 'better-auth/plugins'
import { createMiddleware } from 'hono/factory'
import { createDb } from '#/server/db'
import { hasAnyUser } from '#/server/services/users'

export function createAuth(bindings: Env) {
  const db = createDb(bindings.DB)

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
    }),
    secret: bindings.BETTER_AUTH_SECRET,
    baseURL: bindings.BETTER_AUTH_URL,
    emailAndPassword: {
      enabled: true,
    },
    plugins: [username()],
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path !== '/sign-up/email') return

        if (await hasAnyUser(db)) {
          throw APIError.from('FORBIDDEN', {
            message: 'Sign up is disabled. An account already exists.',
            code: 'SIGN_UP_DISABLED',
          })
        }
      }),
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
