import { env } from 'cloudflare:workers'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schemas'

export function createDb(d1: D1Database) {
  return drizzle(d1, { schema })
}

/**
 * For code that has no Hono context to pull `c.env.DB` from (e.g. TanStack
 * Start server functions/loaders). Backed by `cloudflare:workers`'s
 * AsyncLocalStorage-scoped `env`, populated per-request by the Workers
 * runtime for the whole request's call stack.
 */
export function getDb() {
  return createDb(env.DB)
}

export type Database = ReturnType<typeof createDb>
export * from './schemas'
