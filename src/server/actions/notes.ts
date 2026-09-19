import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '#/server/auth/middleware'
import { getDb } from '#/server/db'
import {
  createNote,
  deleteNote,
  getNoteById,
  listNotes,
  updateNote,
  type CreateNoteInput,
  type UpdateNoteInput,
} from '#/server/services/notes'

export const listNotesFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async () => {
    return listNotes(getDb())
  })

export const getNoteFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    return getNoteById(getDb(), data.id)
  })

export const createNoteFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: CreateNoteInput) => {
    if (!data.title) {
      throw new Error('title is required')
    }
    return data
  })
  .handler(async ({ data }) => {
    return createNote(getDb(), data)
  })

export const updateNoteFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: { id: number } & UpdateNoteInput) => data)
  .handler(async ({ data }) => {
    const { id, ...input } = data
    return updateNote(getDb(), id, input)
  })

export const deleteNoteFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    return deleteNote(getDb(), data.id)
  })
