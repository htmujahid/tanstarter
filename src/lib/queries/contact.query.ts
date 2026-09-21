import { queryOptions } from '@tanstack/react-query'
import {
  getContactSubmissionFn,
  listContactSubmissionsFn,
} from '#/server/actions/contact.action'

export const CONTACT_PAGE_SIZE = 10

export type ContactListParams = {
  q?: string
  sortBy?: 'createdAt' | 'name'
  sortDirection?: 'asc' | 'desc'
  page: number
}

export function contactListQueryOptions(params: ContactListParams) {
  return queryOptions({
    queryKey: ['contact', 'list', params] as const,
    queryFn: () =>
      listContactSubmissionsFn({
        data: {
          q: params.q,
          sortBy: params.sortBy,
          sortDirection: params.sortDirection,
          limit: CONTACT_PAGE_SIZE,
          offset: (params.page - 1) * CONTACT_PAGE_SIZE,
        },
      }),
  })
}

export function contactQueryOptions(id: number) {
  return queryOptions({
    queryKey: ['contact', 'detail', id] as const,
    queryFn: () => getContactSubmissionFn({ data: { id } }),
  })
}
