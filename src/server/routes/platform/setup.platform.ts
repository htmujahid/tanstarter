import { createRoute } from '@hono/zod-openapi'

import { createDb } from '#/server/db'
import { createPublicOpenApiApp } from '#/server/openapi/factory'
import { SetupStatusSchema } from '#/server/openapi/models/setup.model'
import { jsonResponse } from '#/server/openapi/responses'
import { hasAnyUser } from '#/server/services/users.service'

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
