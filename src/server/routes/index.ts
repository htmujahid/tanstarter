import { Hono } from 'hono'
import auth from './auth'
import health from './health'
import platform from './platform'
import v1 from './v1'

const api = new Hono<{ Bindings: Env }>()
  .route('/health', health)
  .route('/auth', auth)
  .route('/v1', v1)
  .route('/platform', platform)

export type ApiType = typeof api
export default api
