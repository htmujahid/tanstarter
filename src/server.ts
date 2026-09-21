import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import { Hono } from 'hono'
import { languageDetector } from 'hono/language'

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  SUPPORTED_LOCALES,
} from './lib/i18n/config'
import api from './server/routes'

const startHandler = createStartHandler(defaultStreamHandler)

const app = new Hono<{ Bindings: Env }>()

app.use(
  '*',
  languageDetector({
    supportedLanguages: [...SUPPORTED_LOCALES],
    fallbackLanguage: DEFAULT_LOCALE,
    order: ['cookie', 'header'],
    lookupCookie: LOCALE_COOKIE_NAME,
  }),
)

app.route('/api', api)

app.all('/api/*', (c) => c.notFound())

app.all('*', (c) => startHandler(c.req.raw))

export type AppType = typeof app

export default app
