import { createRoute } from '@hono/zod-openapi'
import { createDb } from '#/server/db'
import { createPublicOpenApiApp } from '#/server/openapi/factory'
import { jsonResponse } from '#/server/openapi/responses'
import { SetupStatusSchema } from '#/server/openapi/models/setup'
import { hasAnyUser } from '#/server/services/users'

/** Mirrors `src/server/actions/setup.ts` 1:1. Public — used to decide
 * whether sign-up should be offered at all. */

const app = createPublicOpenApiApp()

app.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Setup'],
    security: [],
    responses: {
      200: jsonResponse(SetupStatusSchema, 'Whether initial setup is needed'),
    },
  }),
  async (c) => {
    const db = createDb(c.env.DB)
    const needsSetup = !(await hasAnyUser(db))
    return c.json({ needsSetup })
  },
)

export default app
