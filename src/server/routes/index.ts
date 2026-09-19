import { Hono } from 'hono'
import health from './health'
import notes from './notes'

const api = new Hono<{ Bindings: Env }>()
  .route('/health', health)
  .route('/notes', notes)

export type ApiType = typeof api
export default api
