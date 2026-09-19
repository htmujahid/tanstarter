import { createServerFn } from '@tanstack/react-start'
import { getDb } from '#/server/db'
import { hasAnyUser } from '#/server/services/users'

export const getSetupStatusFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const needsSetup = !(await hasAnyUser(getDb()))
    return { needsSetup }
  },
)
