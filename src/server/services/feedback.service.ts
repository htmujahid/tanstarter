import { and, asc, count, desc, eq, like, sql } from 'drizzle-orm'
import { feedback, user } from '#/server/db'
import type { Database, FeedbackCategory, FeedbackStatus } from '#/server/db'

export interface CreateFeedbackInput {
  category: FeedbackCategory
  message: string
}

const feedbackWithSubmitter = {
  id: feedback.id,
  userId: feedback.userId,
  category: feedback.category,
  message: feedback.message,
  status: feedback.status,
  createdAt: feedback.createdAt,
  updatedAt: feedback.updatedAt,
  submitterName: user.name,
  submitterEmail: user.email,
} as const

const SORTABLE_COLUMNS = {
  createdAt: feedback.createdAt,
  updatedAt: feedback.updatedAt,
} as const

export interface ListFeedbackInput {
  /** Set for a non-admin caller so they only see their own feedback. */
  scopeToUserId?: string
  q?: string
  category?: FeedbackCategory
  status?: FeedbackStatus
  sortBy?: keyof typeof SORTABLE_COLUMNS
  sortDirection?: 'asc' | 'desc'
  limit: number
  offset: number
}

export async function listFeedback(
  db: Database,
  {
    scopeToUserId,
    q,
    category,
    status,
    sortBy,
    sortDirection,
    limit,
    offset,
  }: ListFeedbackInput,
) {
  const conditions = [
    scopeToUserId ? eq(feedback.userId, scopeToUserId) : undefined,
    category ? eq(feedback.category, category) : undefined,
    status ? eq(feedback.status, status) : undefined,
    q ? like(feedback.message, `%${q}%`) : undefined,
  ].filter((condition) => condition !== undefined)
  const where = conditions.length > 0 ? and(...conditions) : undefined

  const column = SORTABLE_COLUMNS[sortBy ?? 'createdAt']
  const orderBy = sortDirection === 'asc' ? asc(column) : desc(column)

  const [rows, [{ total }]] = await Promise.all([
    db
      .select(feedbackWithSubmitter)
      .from(feedback)
      .innerJoin(user, eq(feedback.userId, user.id))
      .where(where)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .all(),
    db.select({ total: count() }).from(feedback).where(where),
  ])

  return { feedback: rows, total }
}

export function getFeedbackById(
  db: Database,
  id: number,
  { scopeToUserId }: { scopeToUserId?: string },
) {
  const where = scopeToUserId
    ? and(eq(feedback.id, id), eq(feedback.userId, scopeToUserId))
    : eq(feedback.id, id)

  return db
    .select(feedbackWithSubmitter)
    .from(feedback)
    .innerJoin(user, eq(feedback.userId, user.id))
    .where(where)
    .get()
}

export async function createFeedback(
  db: Database,
  userId: string,
  input: CreateFeedbackInput,
) {
  const [row] = await db
    .insert(feedback)
    .values({ ...input, userId })
    .returning()
  return row
}

export async function updateFeedbackStatus(
  db: Database,
  id: number,
  status: FeedbackStatus,
) {
  const [row] = await db
    .update(feedback)
    .set({ status, updatedAt: sql`(current_timestamp)` })
    .where(eq(feedback.id, id))
    .returning()
  return row
}

export async function deleteFeedback(db: Database, id: number) {
  const [row] = await db.delete(feedback).where(eq(feedback.id, id)).returning()
  return row
}
