import { createRoute } from '@hono/zod-openapi'
import { getAuth, requireAuth } from '#/server/auth/auth'
import { createAuthOpenApiApp } from '#/server/openapi/factory'
import { jsonResponse } from '#/server/openapi/responses'
import {
  BetterAuthPassthroughListSchema,
  BetterAuthPassthroughSchema,
} from '#/server/openapi/models/admin'

/** Mirrors `src/server/actions/session.ts` 1:1. */

const app = createAuthOpenApiApp()

// getSessionFn — no requireAuth: returns the caller's session, or null if
// unauthenticated, matching the action's own behavior.
app.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Session'],
    security: [],
    responses: {
      200: jsonResponse(
        BetterAuthPassthroughSchema.nullable(),
        "The caller's session, or null if unauthenticated",
      ),
    },
  }),
  async (c) => {
    const session = await getAuth().api.getSession({
      headers: c.req.raw.headers,
    })
    return c.json(session, 200)
  },
)

// listSessionsFn
app.openapi(
  createRoute({
    method: 'get',
    path: '/list',
    tags: ['Session'],
    middleware: [requireAuth] as const,
    responses: {
      200: jsonResponse(
        BetterAuthPassthroughListSchema,
        "The caller's sessions",
      ),
    },
  }),
  async (c) => {
    const sessions = await getAuth().api.listSessions({
      headers: c.req.raw.headers,
    })
    return c.json(sessions, 200)
  },
)

export default app
