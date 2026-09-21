import { env } from 'cloudflare:workers'
import { drizzle } from 'drizzle-orm/d1'

import * as schema from './schemas'

export function createDb(d1: D1Database) {
  return drizzle(d1, { schema })
}

export function getDb() {
  return createDb(env.DB)
}

export type Database = ReturnType<typeof createDb>
export * from './schemas'
