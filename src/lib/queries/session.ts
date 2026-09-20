import { queryOptions } from '@tanstack/react-query'
import { listSessionsFn } from '#/server/actions/session'

export function sessionsQueryOptions() {
  return queryOptions({
    queryKey: ['session', 'list'] as const,
    queryFn: () => listSessionsFn(),
  })
}
