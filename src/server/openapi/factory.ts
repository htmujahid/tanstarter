import { OpenAPIHono } from '@hono/zod-openapi'
import type { Hook } from '@hono/zod-openapi'

import type { AuthEnv } from '#/server/auth/auth'

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
