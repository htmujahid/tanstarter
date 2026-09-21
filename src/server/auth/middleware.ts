import { createMiddleware } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

import { getAuth } from '#/server/auth/auth'

export const authMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const session = await getAuth().api.getSession({
      headers: getRequest().headers,
    })

    if (!session) {
      throw new Error('Unauthorized')
    }

    return next({ context: { user: session.user } })
  },
)
