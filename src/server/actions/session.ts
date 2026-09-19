import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { getAuth } from '#/server/auth/auth'

export const getSessionFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return getAuth().api.getSession({ headers: getRequest().headers })
  },
)
