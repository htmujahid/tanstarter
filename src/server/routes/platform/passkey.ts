import { createRoute } from '@hono/zod-openapi'
import { getAuth, requireAuth } from '#/server/auth/auth'
import { createAuthOpenApiApp } from '#/server/openapi/factory'
import { jsonResponse } from '#/server/openapi/responses'
import { BetterAuthPassthroughListSchema } from '#/server/openapi/models/admin'

/** Mirrors `src/server/actions/passkey.ts` 1:1. */

const app = createAuthOpenApiApp()

app.use(requireAuth)

app.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Passkeys'],
    responses: {
      200: jsonResponse(
        BetterAuthPassthroughListSchema,
        "The caller's passkeys",
      ),
    },
  }),
  async (c) => {
    const passkeys = await getAuth().api.listPasskeys({
      headers: c.req.raw.headers,
    })
    return c.json(passkeys, 200)
  },
)

export default app
