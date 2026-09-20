import { queryOptions } from '@tanstack/react-query'
import { getNoteFn, listNotesFn } from '#/server/actions/notes'
import type { SortableField } from '#/components/home/notes/notes-table-column'

export const NOTES_PAGE_SIZE = 10

export type NotesListParams = {
  q?: string
  sortBy?: SortableField
  sortDirection?: 'asc' | 'desc'
  page: number
}

export function notesQueryOptions(params: NotesListParams) {
  return queryOptions({
    queryKey: ['notes', 'list', params] as const,
    queryFn: () =>
      listNotesFn({
        data: {
          q: params.q,
          sortBy: params.sortBy,
          sortDirection: params.sortDirection,
          limit: NOTES_PAGE_SIZE,
          offset: (params.page - 1) * NOTES_PAGE_SIZE,
        },
      }),
  })
}

export function noteQueryOptions(id: number) {
  return queryOptions({
    queryKey: ['notes', 'detail', id] as const,
    queryFn: () => getNoteFn({ data: { id } }),
  })
}
