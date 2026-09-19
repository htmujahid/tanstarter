import { queryOptions } from '@tanstack/react-query'
import { authClient } from '#/lib/auth-client'
import { getAdminStatsFn, getUserFn, listUsersFn } from '#/server/actions/admin'
import type { SortableField } from '#/components/admin/UsersTableColumn'

export const USERS_PAGE_SIZE = 10

export function adminStatsQueryOptions() {
  return queryOptions({
    queryKey: ['admin', 'stats'] as const,
    queryFn: () => getAdminStatsFn(),
  })
}

export type UsersListParams = {
  q?: string
  role?: 'admin' | 'user'
  sortBy?: SortableField
  sortDirection?: 'asc' | 'desc'
  page: number
}

export function usersQueryOptions(params: UsersListParams) {
  return queryOptions({
    queryKey: ['admin', 'users', params] as const,
    queryFn: () =>
      listUsersFn({
        data: {
          searchValue: params.q,
          role: params.role,
          sortBy: params.sortBy,
          sortDirection: params.sortDirection,
          limit: USERS_PAGE_SIZE,
          offset: (params.page - 1) * USERS_PAGE_SIZE,
        },
      }),
  })
}

export function userQueryOptions(userId: string) {
  return queryOptions({
    queryKey: ['admin', 'users', userId] as const,
    queryFn: () => getUserFn({ data: { id: userId } }),
  })
}

export function userSessionsQueryOptions(userId: string) {
  return queryOptions({
    queryKey: ['admin', 'users', userId, 'sessions'] as const,
    queryFn: async () => {
      const { data, error } = await authClient.admin.listUserSessions({
        userId,
      })
      if (error) throw new Error(error.message ?? 'Unable to load sessions')
      return data.sessions
    },
  })
}
