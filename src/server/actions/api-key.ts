import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { getAuth } from '#/server/auth/auth'
import { authMiddleware } from '#/server/auth/middleware'

export const listApiKeysFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async () => {
    const { apiKeys } = await getAuth().api.listApiKeys({
      headers: getRequest().headers,
    })
    return apiKeys
  })
