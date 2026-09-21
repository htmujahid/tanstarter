import { queryOptions } from '@tanstack/react-query'
import { getSessionFn, listSessionsFn } from '#/server/actions/session'

export const CURRENT_SESSION_QUERY_KEY = ['session', 'current'] as const

export function currentSessionQueryOptions() {
  return queryOptions({
    queryKey: CURRENT_SESSION_QUERY_KEY,
    queryFn: () => getSessionFn(),
  })
}

export function sessionsQueryOptions() {
  return queryOptions({
    queryKey: ['session', 'list'] as const,
    queryFn: () => listSessionsFn(),
  })
}
