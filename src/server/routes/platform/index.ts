import { OpenAPIHono } from '@hono/zod-openapi'

import { mountDocs, registerSecuritySchemes } from '#/server/openapi/mount'

import announcements from './announcements.platform'
import contact from './contact.platform'
import feedback from './feedback.platform'
import notes from './notes.platform'
import setup from './setup.platform'

const platform = new OpenAPIHono<{ Bindings: Env }>()
  .route('/setup', setup)
  .route('/contact', contact)
  .route('/feedback', feedback)
  .route('/announcements', announcements)
  .route('/notes', notes)

registerSecuritySchemes(platform)
mountDocs(platform, 'Starter Kit API — Platform')

export default platform
