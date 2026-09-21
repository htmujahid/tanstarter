import { OpenAPIHono } from '@hono/zod-openapi'

import { mountDocs, registerSecuritySchemes } from '#/server/openapi/mount'

import announcements from './announcements.v1'
import contact from './contact.v1'
import feedback from './feedback.v1'

const v1 = new OpenAPIHono<{ Bindings: Env }>()
  .route('/contact', contact)
  .route('/announcements', announcements)
  .route('/feedback', feedback)

registerSecuritySchemes(v1)
mountDocs(v1, 'Starter Kit API — v1')

export default v1
