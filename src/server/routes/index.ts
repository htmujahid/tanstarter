import { Hono } from 'hono'
import health from './health'

const api = new Hono().route('/health', health)

export type ApiType = typeof api
export default api