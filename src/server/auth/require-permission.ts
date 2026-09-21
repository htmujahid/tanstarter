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

export async function requirePermission(
  role: string | null | undefined,
  permissions: PermissionCheck,
) {
  if (!(await hasPermission(role, permissions))) {
    throw new Error('You do not have permission to perform this action')
  }
}

export function requirePermissionRoute(permissions: PermissionCheck) {
  return createHonoMiddleware<AuthEnv>(async (c, next) => {
    if (!(await hasPermission(c.var.session!.user.role, permissions))) {
      return c.json({ error: 'forbidden' }, 403)
    }

    await next()
  })
}
