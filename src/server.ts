import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import { Hono } from 'hono'
import api from './server/routes'

const startHandler = createStartHandler(defaultStreamHandler)

const app = new Hono<{ Bindings: Env }>().route('/api', api)

app.all('/api/*', (c) => c.notFound() )

app.all('*', (c) => startHandler(c.req.raw))

export type AppType = typeof app

export default app
