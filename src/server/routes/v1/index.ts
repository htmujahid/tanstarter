import { OpenAPIHono } from '@hono/zod-openapi'
import { registerSecuritySchemes, mountDocs } from '#/server/openapi/mount'
import announcements from './announcements'
import notes from './notes'

/**
 * Public storefront-facing REST API. Stable, versioned contract for any
 * external consumer (a storefront frontend, third-party integration, etc).
 */
const v1 = new OpenAPIHono<{ Bindings: Env }>()
  .route('/notes', notes)
  .route('/announcements', announcements)

registerSecuritySchemes(v1)
mountDocs(v1, 'Commerce API — v1')

export default v1
