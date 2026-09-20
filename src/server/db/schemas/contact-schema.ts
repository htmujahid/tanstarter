import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const contactSubmissions = sqliteTable('contact_submissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`),
})

export type ContactSubmission = typeof contactSubmissions.$inferSelect
export type NewContactSubmission = typeof contactSubmissions.$inferInsert
