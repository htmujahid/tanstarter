import { and, asc, count, desc, eq, like, sql } from 'drizzle-orm'

import type { Database } from '#/server/db'
import { announcements } from '#/server/db'

export interface CreateAnnouncementInput {
  title: string
  body?: string
  published?: boolean
}

export interface UpdateAnnouncementInput {
  title?: string
  body?: string
  published?: boolean
}

const SORTABLE_COLUMNS = {
  title: announcements.title,
  createdAt: announcements.createdAt,
  updatedAt: announcements.updatedAt,
} as const

export interface ListAnnouncementsInput {
  onlyPublished: boolean
  published?: boolean
  q?: string
  sortBy?: keyof typeof SORTABLE_COLUMNS
  sortDirection?: 'asc' | 'desc'
  limit: number
  offset: number
}

export async function listAnnouncements(
  db: Database,
  {
    onlyPublished,
    published,
    q,
    sortBy,
    sortDirection,
    limit,
    offset,
  }: ListAnnouncementsInput,
) {
  const publishedEq = onlyPublished ? true : published
  const conditions = [
    publishedEq === undefined
      ? undefined
      : eq(announcements.published, publishedEq),
    q ? like(announcements.title, `%${q}%`) : undefined,
  ].filter((condition) => condition !== undefined)
  const where = conditions.length > 0 ? and(...conditions) : undefined

  const column = SORTABLE_COLUMNS[sortBy ?? 'createdAt']
  const orderBy = sortDirection === 'asc' ? asc(column) : desc(column)

  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(announcements)
      .where(where)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .all(),
    db.select({ total: count() }).from(announcements).where(where),
  ])

  return { announcements: rows, total }
}

export function getAnnouncementById(
  db: Database,
  id: number,
  { onlyPublished }: { onlyPublished: boolean },
) {
  const where = onlyPublished
    ? and(eq(announcements.id, id), eq(announcements.published, true))
    : eq(announcements.id, id)

  return db.select().from(announcements).where(where).get()
}

export async function createAnnouncement(
  db: Database,
  input: CreateAnnouncementInput,
) {
  const [announcement] = await db
    .insert(announcements)
    .values(input)
    .returning()
  return announcement
}

export async function updateAnnouncement(
  db: Database,
  id: number,
  input: UpdateAnnouncementInput,
) {
  const [announcement] = await db
    .update(announcements)
    .set({ ...input, updatedAt: sql`(current_timestamp)` })
    .where(eq(announcements.id, id))
    .returning()
  return announcement
}

export async function deleteAnnouncement(db: Database, id: number) {
  const [announcement] = await db
    .delete(announcements)
    .where(eq(announcements.id, id))
    .returning()
  return announcement
}
