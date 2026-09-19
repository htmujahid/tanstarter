import type { Database } from '#/server/db'
import { user } from '#/server/db'

export async function hasAnyUser(db: Database) {
  const existing = await db.select({ id: user.id }).from(user).limit(1)
  return existing.length > 0
}
