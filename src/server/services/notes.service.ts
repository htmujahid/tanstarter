import { and, asc, count, desc, eq, like, sql } from 'drizzle-orm'

import type { Database } from '#/server/db'
import { notes } from '#/server/db'

export interface CreateNoteInput {
  title: string
  body?: string
}

export interface UpdateNoteInput {
  title?: string
  body?: string
}

const SORTABLE_COLUMNS = {
  title: notes.title,
  createdAt: notes.createdAt,
  updatedAt: notes.updatedAt,
} as const

export interface ListNotesInput {
  userId: string
  q?: string
  sortBy?: keyof typeof SORTABLE_COLUMNS
  sortDirection?: 'asc' | 'desc'
  limit: number
  offset: number
}

export async function listNotes(
  db: Database,
  { userId, q, sortBy, sortDirection, limit, offset }: ListNotesInput,
) {
  const where = q
    ? and(eq(notes.userId, userId), like(notes.title, `%${q}%`))
    : eq(notes.userId, userId)
  const column = SORTABLE_COLUMNS[sortBy ?? 'createdAt']
  const orderBy = sortDirection === 'asc' ? asc(column) : desc(column)

  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(notes)
      .where(where)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .all(),
    db.select({ total: count() }).from(notes).where(where),
  ])

  return { notes: rows, total }
}

export function getNoteById(db: Database, id: number, userId: string) {
  return db
    .select()
    .from(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, userId)))
    .get()
}

export async function createNote(
  db: Database,
  userId: string,
  input: CreateNoteInput,
) {
  const [note] = await db
    .insert(notes)
    .values({ ...input, userId })
    .returning()
  return note
}

export async function updateNote(
  db: Database,
  id: number,
  userId: string,
  input: UpdateNoteInput,
) {
  const [note] = await db
    .update(notes)
    .set({ ...input, updatedAt: sql`(current_timestamp)` })
    .where(and(eq(notes.id, id), eq(notes.userId, userId)))
    .returning()
  return note
}

export async function deleteNote(db: Database, id: number, userId: string) {
  const [note] = await db
    .delete(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, userId)))
    .returning()
  return note
}
