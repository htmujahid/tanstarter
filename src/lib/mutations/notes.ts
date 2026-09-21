import { NonRetriableError } from '@tanstack/offline-transactions'
import {
  createNoteFn,
  deleteNoteFn,
  updateNoteFn,
} from '#/server/actions/notes'
import type { OfflineConfig } from '@tanstack/offline-transactions'
import type { NotesCollection } from '#/lib/collections/notes'
import type { Note } from '#/server/db'

async function callOrNonRetriable<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (navigator.onLine) {
      throw new NonRetriableError(
        error instanceof Error ? error.message : 'Request failed.',
      )
    }
    throw error
  }
}

export const notesMutationFns: OfflineConfig['mutationFns'] = {
  createNote: async ({ transaction }) => {
    const mutation = transaction.mutations[0]
    const collection = mutation.collection as unknown as NotesCollection
    const modified = mutation.modified as Note

    const note = await callOrNonRetriable(() =>
      createNoteFn({
        data: { title: modified.title, body: modified.body ?? undefined },
      }),
    )

    // The temporary negative id only ever exists in the transaction's
    // optimistic overlay, never in syncedData, so there's nothing to
    // writeDelete — it's dropped automatically once this transaction
    // commits. Only the server-confirmed row needs writing.
    collection.utils.writeInsert(note)
  },
  updateNote: async ({ transaction }) => {
    const mutation = transaction.mutations[0]
    const collection = mutation.collection as unknown as NotesCollection
    const changes = mutation.changes as Partial<Note>

    const note = (await callOrNonRetriable(() =>
      updateNoteFn({
        data: {
          id: mutation.key as number,
          title: changes.title,
          body: changes.body ?? undefined,
        },
      }),
    )) as Note | undefined
    if (!note) throw new NonRetriableError('Note not found.')
    collection.utils.writeUpsert(note)
  },
  deleteNote: async ({ transaction }) => {
    const mutation = transaction.mutations[0]
    const collection = mutation.collection as unknown as NotesCollection

    await callOrNonRetriable(() =>
      deleteNoteFn({ data: { id: mutation.key as number } }),
    )
    collection.utils.writeDelete(mutation.key as number)
  },
}
