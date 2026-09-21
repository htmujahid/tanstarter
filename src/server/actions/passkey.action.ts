import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

import { getAuth } from '#/server/auth/auth'
import { authMiddleware } from '#/server/auth/middleware'

export const listPasskeysFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async () => {
    return getAuth().api.listPasskeys({ headers: getRequest().headers })
  })
