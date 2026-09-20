import { createMiddleware as createHonoMiddleware } from 'hono/factory'
import { getAuth } from '#/server/auth/auth'
import type { AuthEnv } from '#/server/auth/auth'
import type { PermissionCheck } from '#/server/auth/permissions'

async function hasPermission(
  role: string | null | undefined,
  permissions: PermissionCheck,
) {
  const { success } = await getAuth().api.userHasPermission({
    body: {
      role: (role ?? 'user') as 'admin' | 'user',
      permissions,
    },
  })

  return success
}

/**
 * Server function permission guard — call at the top of a `createServerFn`
 * handler body, e.g. `await requirePermission(context.user.role, { notes: ['create'] })`.
 *
 * Deliberately a plain function, not a middleware factory: TanStack Start
 * splits `.handler()` bodies out of the client bundle, but can't statically
 * split a middleware object built by a factory function called inside
 * `.middleware([...])` — that pulled `auth.ts` (and `cloudflare:workers`)
 * into the client bundle. Calling this inside the handler keeps it safely
 * server-only.
 */
export async function requirePermission(
  role: string | null | undefined,
  permissions: PermissionCheck,
) {
  if (!(await hasPermission(role, permissions))) {
    throw new Error('You do not have permission to perform this action')
  }
}

/**
 * Hono route middleware — attach per-route, e.g.
 * `app.get('/', requirePermissionRoute({ notes: ['read'] }), handler)`.
 * Runs after `requireAuth`, so `c.var.session` is already populated.
 * Safe as a middleware factory here: `server/routes/*` is never imported
 * by client code.
 */
export function requirePermissionRoute(permissions: PermissionCheck) {
  return createHonoMiddleware<AuthEnv>(async (c, next) => {
    if (!(await hasPermission(c.var.session!.user.role, permissions))) {
      return c.json({ error: 'forbidden' }, 403)
    }

    await next()
  })
}
