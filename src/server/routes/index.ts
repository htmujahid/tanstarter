import { Hono } from 'hono'
import auth from './auth'
import health from './health'
import notes from './notes'

const api = new Hono<{ Bindings: Env }>()
  .route('/health', health)
  .route('/notes', notes)
  .route('/auth', auth)

export type ApiType = typeof api
export default api
