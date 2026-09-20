import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import { Hono } from 'hono'
import { languageDetector } from 'hono/language'
import api from './server/routes'
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  SUPPORTED_LOCALES,
} from './lib/i18n/config'

const startHandler = createStartHandler(defaultStreamHandler)

const app = new Hono<{ Bindings: Env }>()

// Detects the caller's locale (cookie, then Accept-Language) and persists it
// back as a cookie so the SSR shell (src/routes/__root.tsx) and this app's
// API/auth routes stay in agreement on locale across requests.
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

app.all('/api/*', (c) => c.notFound() )

app.all('*', (c) => startHandler(c.req.raw))

export type AppType = typeof app

export default app
