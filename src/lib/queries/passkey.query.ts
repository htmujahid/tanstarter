import { queryOptions } from '@tanstack/react-query'

import { listPasskeysFn } from '#/server/actions/passkey.action'

export function passkeysQueryOptions() {
  return queryOptions({
    queryKey: ['passkey', 'list'] as const,
    queryFn: () => listPasskeysFn(),
  })
}
