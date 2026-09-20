import { Hono } from 'hono'
import admin from './admin'
import announcements from './announcements'
import apiKey from './api-key'
import contact from './contact'
import feedback from './feedback'
import notes from './notes'
import passkey from './passkey'
import session from './session'
import setup from './setup'

/**
 * Internal automation API — a 1:1 REST mirror of every `createServerFn` in
 * `src/server/actions/`. Meant for programmatic/agent consumers acting on
 * behalf of a signed-in user (session cookie or API key — both work here
 * since `requireAuth` resolves either transparently), not for the
 * storefront (see `v1` for that).
 */
const platform = new Hono<{ Bindings: Env }>()
  .route('/session', session)
  .route('/passkeys', passkey)
  .route('/api-keys', apiKey)
  .route('/admin', admin)
  .route('/setup', setup)
  .route('/contact', contact)
  .route('/feedback', feedback)
  .route('/announcements', announcements)
  .route('/notes', notes)

export default platform
