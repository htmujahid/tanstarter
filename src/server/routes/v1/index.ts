import { Hono } from 'hono'
import announcements from './announcements'
import notes from './notes'

/**
 * Public storefront-facing REST API. Stable, versioned contract for any
 * external consumer (a storefront frontend, third-party integration, etc).
 */
const v1 = new Hono<{ Bindings: Env }>()
  .route('/notes', notes)
  .route('/announcements', announcements)

export default v1
