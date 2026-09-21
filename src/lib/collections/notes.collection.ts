import { persistedCollectionOptions } from '@tanstack/browser-db-sqlite-persistence'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { collectionOptions, useDbClient } from '@tanstack/react-db'
import type { QueryClient } from '@tanstack/react-query'

import { persistence } from '#/lib/db/client-persistence'
import { listNotesFn } from '#/server/actions/notes.action'
import type { Note } from '#/server/db'

const NOTES_COLLECTION_LIMIT = 1000

export const notesCollectionOptions = collectionOptions('notes', (client) => {
  const baseOptions = queryCollectionOptions({
    id: 'notes',
    queryKey: ['notes', 'collection'],
    queryClient: client.requireDependency<QueryClient>('queryClient'),
    getKey: (note: Note) => note.id,
    queryFn: async () => {
      const { notes } = await listNotesFn({
        data: { limit: NOTES_COLLECTION_LIMIT, offset: 0 },
      })
      return notes
    },
  })

  return persistedCollectionOptions({
    ...baseOptions,
    persistence,
    schemaVersion: 1,
  }) as typeof baseOptions
})

export function useNotesCollection() {
  return useDbClient().collection(notesCollectionOptions)
}

export type NotesCollection = ReturnType<typeof useNotesCollection>
