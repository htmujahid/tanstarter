import { OpenAPIHono } from '@hono/zod-openapi'
import { registerSecuritySchemes, mountDocs } from '#/server/openapi/mount'
import announcements from './announcements.platform'
import contact from './contact.platform'
import feedback from './feedback.platform'
import notes from './notes.platform'
import setup from './setup.platform'

/**
 * Internal automation API — a 1:1 REST mirror of every `createServerFn` in
 * `src/server/actions/`. Meant for programmatic/agent consumers acting on
 * behalf of a signed-in user (session cookie or API key — both work here
 * since `requireAuth` resolves either transparently), not for the
 * public site (see `v1` for that).
 *
 * Session/passkey/api-key/admin management deliberately aren't mirrored
 * here — they were pure passthroughs to better-auth's own API
 * (`getAuth().api.listUsers`, `.listPasskeys`, `.listApiKeys`,
 * `.getSession`, etc.), which is already reachable directly at `/api/auth`
 * (see the `openAPI()` plugin in `src/server/auth/auth.ts`). Proxying that
 * through this router added an extra hop with no behavior of its own.
 */
const platform = new OpenAPIHono<{ Bindings: Env }>()
  .route('/setup', setup)
  .route('/contact', contact)
  .route('/feedback', feedback)
  .route('/announcements', announcements)
  .route('/notes', notes)

registerSecuritySchemes(platform)
mountDocs(platform, 'Starter Kit API — Platform')

export default platform
