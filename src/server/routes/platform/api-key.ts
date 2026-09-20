import { createRoute } from '@hono/zod-openapi'
import { getAuth, requireAuth } from '#/server/auth/auth'
import { createAuthOpenApiApp } from '#/server/openapi/factory'
import { jsonResponse } from '#/server/openapi/responses'
import { BetterAuthPassthroughListSchema } from '#/server/openapi/models/admin'

/** Mirrors `src/server/actions/api-key.ts` 1:1. */

const app = createAuthOpenApiApp()

app.use(requireAuth)

app.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['API Keys'],
    responses: {
      200: jsonResponse(
        BetterAuthPassthroughListSchema,
        "The caller's API keys",
      ),
    },
  }),
  async (c) => {
    const { apiKeys } = await getAuth().api.listApiKeys({
      headers: c.req.raw.headers,
    })
    return c.json(apiKeys, 200)
  },
)

export default app
