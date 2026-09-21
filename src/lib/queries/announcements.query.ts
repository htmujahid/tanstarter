import { queryOptions } from '@tanstack/react-query'

import type { SortableField } from '#/components/admin/announcements/announcements-table-column'
import {
  getPublicAnnouncementFn,
  listPublicAnnouncementsFn,
} from '#/server/actions/announcements.action'

export const ANNOUNCEMENTS_PAGE_SIZE = 10

export type SiteAnnouncementsListParams = {
  q?: string
  sortBy?: SortableField
  sortDirection?: 'asc' | 'desc'
  page: number
}

export function siteAnnouncementsQueryOptions(
  params: SiteAnnouncementsListParams,
) {
  return queryOptions({
    queryKey: ['site-announcements', 'list', params] as const,
    queryFn: () =>
      listPublicAnnouncementsFn({
        data: {
          q: params.q,
          sortBy: params.sortBy,
          sortDirection: params.sortDirection,
          limit: ANNOUNCEMENTS_PAGE_SIZE,
          offset: (params.page - 1) * ANNOUNCEMENTS_PAGE_SIZE,
        },
      }),
  })
}

export function siteAnnouncementQueryOptions(id: number) {
  return queryOptions({
    queryKey: ['site-announcements', 'detail', id] as const,
    queryFn: () => getPublicAnnouncementFn({ data: { id } }),
  })
}
