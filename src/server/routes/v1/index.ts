import { OpenAPIHono } from '@hono/zod-openapi'
import { registerSecuritySchemes, mountDocs } from '#/server/openapi/mount'
import announcements from './announcements.v1'
import contact from './contact.v1'
import feedback from './feedback.v1'

/**
 * Public storefront-facing REST API. Stable, versioned contract mirroring
 * `src/routes/site/` (contact, announcements, feedback) for any external
 * consumer (a storefront frontend, third-party integration, etc).
 */
const v1 = new OpenAPIHono<{ Bindings: Env }>()
  .route('/contact', contact)
  .route('/announcements', announcements)
  .route('/feedback', feedback)

registerSecuritySchemes(v1)
mountDocs(v1, 'Commerce API — v1')

export default v1
