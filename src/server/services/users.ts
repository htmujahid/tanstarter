import { count, eq } from 'drizzle-orm'
import type { Database } from '#/server/db'
import { user } from '#/server/db'

export async function hasAnyUser(db: Database) {
  const existing = await db.select({ id: user.id }).from(user).limit(1)
  return existing.length > 0
}

export async function getUserStats(db: Database) {
  const [[{ total }], [{ admins }], [{ banned }]] = await Promise.all([
    db.select({ total: count() }).from(user),
    db.select({ admins: count() }).from(user).where(eq(user.role, 'admin')),
    db.select({ banned: count() }).from(user).where(eq(user.banned, true)),
  ])

  return { total, admins, banned }
}
