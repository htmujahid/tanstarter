import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import { Hono } from 'hono'

const startHandler = createStartHandler(defaultStreamHandler)

const app = new Hono()

const api = new Hono()

api.get('/health', (c) =>
  c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }),
)

app.route('/api', api)

app.all('*', (c) => startHandler(c.req.raw))

export default app
