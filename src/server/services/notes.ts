import { eq, sql } from 'drizzle-orm'
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

export function listNotes(db: Database) {
  return db.select().from(notes).all()
}

export function getNoteById(db: Database, id: number) {
  return db.select().from(notes).where(eq(notes.id, id)).get()
}

export async function createNote(db: Database, input: CreateNoteInput) {
  const [note] = await db.insert(notes).values(input).returning()
  return note
}

export async function updateNote(
  db: Database,
  id: number,
  input: UpdateNoteInput,
) {
  const [note] = await db
    .update(notes)
    .set({ ...input, updatedAt: sql`(current_timestamp)` })
    .where(eq(notes.id, id))
    .returning()
  return note
}

export async function deleteNote(db: Database, id: number) {
  const [note] = await db.delete(notes).where(eq(notes.id, id)).returning()
  return note
}
