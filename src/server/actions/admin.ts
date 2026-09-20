import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { getAuth } from '#/server/auth/auth'
import { authMiddleware } from '#/server/auth/middleware'
import { getDb } from '#/server/db'
import { getUserStats } from '#/server/services/users'

export const listUsersFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(
    (data: {
      searchValue?: string
      role?: 'admin' | 'user'
      sortBy?: string
      sortDirection?: 'asc' | 'desc'
      limit: number
      offset: number
    }) => data,
  )
  .handler(async ({ data }) => {
    return getAuth().api.listUsers({
      query: {
        searchValue: data.searchValue || undefined,
        searchField: data.searchValue?.includes('@') ? 'email' : 'name',
        searchOperator: 'contains',
        filterField: data.role ? 'role' : undefined,
        filterValue: data.role,
        filterOperator: data.role ? 'eq' : undefined,
        limit: data.limit,
        offset: data.offset,
        sortBy: data.sortBy ?? 'createdAt',
        sortDirection: data.sortDirection ?? 'desc',
      },
      headers: getRequest().headers,
    })
  })

export const getUserFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return getAuth().api.getUser({
      query: { id: data.id },
      headers: getRequest().headers,
    })
  })

export const getAdminStatsFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async () => {
    return getUserStats(getDb())
  })

export const listUserSessionsFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    return getAuth().api.listUserSessions({
      body: { userId: data.userId },
      headers: getRequest().headers,
    })
  })
