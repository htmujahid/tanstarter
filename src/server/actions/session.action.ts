import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

import { getAuth } from '#/server/auth/auth'
import { authMiddleware } from '#/server/auth/middleware'

export const getSessionFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return getAuth().api.getSession({ headers: getRequest().headers })
  },
)

export const listSessionsFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async () => {
    return getAuth().api.listSessions({ headers: getRequest().headers })
  })
