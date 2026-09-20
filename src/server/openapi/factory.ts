import { OpenAPIHono } from '@hono/zod-openapi'
import type { Hook } from '@hono/zod-openapi'
import type { AuthEnv } from '#/server/auth/auth'

/**
 * Fires only for request shapes with no existing hand-written precedent
 * (e.g. a field sent with the wrong JSON type). Every pre-existing
 * business-rule check (`'title is required'`, `'invalid category'`, etc.)
 * still runs in the handler body against the now-typed data and returns
 * its own exact legacy error string/status — this hook never overrides
 * those, it only covers the gap they didn't previously check.
 */
export const openApiErrorHook: Hook<unknown, any, any, any> = (result, c) => {
  if (!result.success) {
    return c.json({ error: 'invalid request' }, 400)
  }
}

export function createAuthOpenApiApp() {
  return new OpenAPIHono<AuthEnv>({ defaultHook: openApiErrorHook })
}

export function createPublicOpenApiApp() {
  return new OpenAPIHono<{ Bindings: Env }>({ defaultHook: openApiErrorHook })
}
