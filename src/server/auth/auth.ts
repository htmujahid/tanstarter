import { env } from 'cloudflare:workers'
import { eq } from 'drizzle-orm'
import { APIError, betterAuth } from 'better-auth'
import { createAuthMiddleware } from 'better-auth/api'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin as adminPlugin, openAPI, username } from 'better-auth/plugins'
import { apiKey } from '@better-auth/api-key'
import { passkey } from '@better-auth/passkey'
import { i18n, locales } from '@better-auth/i18n'
import { createMiddleware } from 'hono/factory'
import { createDb, user } from '#/server/db'
import { hasAnyUser } from '#/server/services/users.service'
import { LOCALE_COOKIE_NAME } from '#/lib/i18n/config'
import { ur } from '#/server/auth/locales/ur'
import {
  ac,
  admin as adminRole,
  user as userRole,
} from '#/server/auth/permissions'

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
    plugins: [
      username(),
      adminPlugin({
        ac,
        roles: { admin: adminRole, user: userRole },
      }),
      passkey({ rpName: 'Starter Kit' }),
      apiKey({
        enableSessionForAPIKeys: true,
        requireName: true,
        defaultPrefix: 'starter_',
        // `defaultPrefix` is 9 chars; capture past it so `start` actually
        // distinguishes keys instead of just echoing the shared prefix.
        startingCharactersConfig: { charactersLength: 15 },
      }),
      openAPI(),
      i18n({
        translations: { en: locales.en, ur },
        defaultLocale: 'en',
        detection: ['cookie', 'header'],
        localeCookie: LOCALE_COOKIE_NAME,
      }),
    ],
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
      after: createAuthMiddleware(async (ctx) => {
        if (ctx.path !== '/sign-up/email') return

        const newSession = ctx.context.newSession
        if (!newSession) return

        const existingUsers = await db
          .select({ id: user.id })
          .from(user)
          .limit(2)

        if (existingUsers.length === 1) {
          await db
            .update(user)
            .set({ role: 'admin' })
            .where(eq(user.id, newSession.user.id))
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
