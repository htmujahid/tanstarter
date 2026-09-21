import { relations, sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { user } from '#/server/db/schemas/auth.schema'

export const feedback = sqliteTable(
  'feedback',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    category: text('category').notNull().default('general'),
    message: text('message').notNull(),
    status: text('status').notNull().default('new'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(current_timestamp)`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => [
    index('feedback_userId_idx').on(table.userId),
    index('feedback_status_idx').on(table.status),
  ],
)

export const feedbackRelations = relations(feedback, ({ one }) => ({
  user: one(user, {
    fields: [feedback.userId],
    references: [user.id],
  }),
}))

export type Feedback = typeof feedback.$inferSelect
export type NewFeedback = typeof feedback.$inferInsert

export const FEEDBACK_CATEGORIES = ['bug', 'feature', 'general'] as const
export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number]

export const FEEDBACK_STATUSES = ['new', 'reviewed', 'resolved'] as const
export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number]
