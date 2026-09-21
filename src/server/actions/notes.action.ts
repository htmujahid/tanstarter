import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '#/server/auth/middleware'
import { requirePermission } from '#/server/auth/require-permission'
import { getDb } from '#/server/db'
import {
  createNote,
  deleteNote,
  getNoteById,
  listNotes,
  updateNote,
} from '#/server/services/notes.service'
import type {
  CreateNoteInput,
  ListNotesInput,
  UpdateNoteInput,
} from '#/server/services/notes.service'

export const listNotesFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator((data: Omit<ListNotesInput, 'userId'>) => data)
  .handler(async ({ data, context }) => {
    await requirePermission(context.user.role, { notes: ['read'] })
    return listNotes(getDb(), { ...data, userId: context.user.id })
  })

export const getNoteFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator((data: { id: number }) => data)
  .handler(async ({ data, context }) => {
    await requirePermission(context.user.role, { notes: ['read'] })
    const note = await getNoteById(getDb(), data.id, context.user.id)

    if (!note) {
      throw new Error('Note not found')
    }

    return note
  })

export const createNoteFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: CreateNoteInput) => {
    if (!data.title) {
      throw new Error('title is required')
    }
    return data
  })
  .handler(async ({ data, context }) => {
    await requirePermission(context.user.role, { notes: ['create'] })
    return createNote(getDb(), context.user.id, data)
  })

export const updateNoteFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: { id: number } & UpdateNoteInput) => data)
  .handler(async ({ data, context }) => {
    await requirePermission(context.user.role, { notes: ['update'] })
    const { id, ...input } = data
    return updateNote(getDb(), id, context.user.id, input)
  })

export const deleteNoteFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: { id: number }) => data)
  .handler(async ({ data, context }) => {
    await requirePermission(context.user.role, { notes: ['delete'] })
    return deleteNote(getDb(), data.id, context.user.id)
  })
