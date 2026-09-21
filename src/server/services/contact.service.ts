import { asc, count, desc, eq, like } from 'drizzle-orm'

import { contactSubmissions } from '#/server/db'
import type { Database } from '#/server/db'

export interface CreateContactSubmissionInput {
  name: string
  email: string
  message: string
}

const SORTABLE_COLUMNS = {
  createdAt: contactSubmissions.createdAt,
  name: contactSubmissions.name,
} as const

export interface ListContactSubmissionsInput {
  q?: string
  sortBy?: keyof typeof SORTABLE_COLUMNS
  sortDirection?: 'asc' | 'desc'
  limit: number
  offset: number
}

export async function listContactSubmissions(
  db: Database,
  { q, sortBy, sortDirection, limit, offset }: ListContactSubmissionsInput,
) {
  const where = q ? like(contactSubmissions.name, `%${q}%`) : undefined
  const column = SORTABLE_COLUMNS[sortBy ?? 'createdAt']
  const orderBy = sortDirection === 'asc' ? asc(column) : desc(column)

  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(contactSubmissions)
      .where(where)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .all(),
    db.select({ total: count() }).from(contactSubmissions).where(where),
  ])

  return { contactSubmissions: rows, total }
}

export function getContactSubmissionById(db: Database, id: number) {
  return db
    .select()
    .from(contactSubmissions)
    .where(eq(contactSubmissions.id, id))
    .get()
}

export async function createContactSubmission(
  db: Database,
  input: CreateContactSubmissionInput,
) {
  const [row] = await db.insert(contactSubmissions).values(input).returning()
  return row
}

export async function deleteContactSubmission(db: Database, id: number) {
  const [row] = await db
    .delete(contactSubmissions)
    .where(eq(contactSubmissions.id, id))
    .returning()
  return row
}
