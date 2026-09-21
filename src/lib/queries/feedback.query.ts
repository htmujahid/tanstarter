import { queryOptions } from '@tanstack/react-query'
import { getFeedbackFn, listFeedbackFn } from '#/server/actions/feedback.action'
import type { FeedbackCategory, FeedbackStatus } from '#/server/db'

export const FEEDBACK_PAGE_SIZE = 10

export type FeedbackListParams = {
  q?: string
  category?: FeedbackCategory
  status?: FeedbackStatus
  sortBy?: 'createdAt' | 'updatedAt'
  sortDirection?: 'asc' | 'desc'
  page: number
}

export function feedbackListQueryOptions(params: FeedbackListParams) {
  return queryOptions({
    queryKey: ['feedback', 'list', params] as const,
    queryFn: () =>
      listFeedbackFn({
        data: {
          q: params.q,
          category: params.category,
          status: params.status,
          sortBy: params.sortBy,
          sortDirection: params.sortDirection,
          limit: FEEDBACK_PAGE_SIZE,
          offset: (params.page - 1) * FEEDBACK_PAGE_SIZE,
        },
      }),
  })
}

export function feedbackQueryOptions(id: number) {
  return queryOptions({
    queryKey: ['feedback', 'detail', id] as const,
    queryFn: () => getFeedbackFn({ data: { id } }),
  })
}
