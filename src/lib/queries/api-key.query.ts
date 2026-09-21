import { queryOptions } from '@tanstack/react-query'
import { listApiKeysFn } from '#/server/actions/api-key.action'

export function apiKeysQueryOptions() {
  return queryOptions({
    queryKey: ['api-key', 'list'] as const,
    queryFn: () => listApiKeysFn(),
  })
}
