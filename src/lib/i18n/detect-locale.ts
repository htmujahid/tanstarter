import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, isSupportedLocale } from '#/lib/i18n/config'
import type { Locale } from '#/lib/i18n/config'

// Mirrors the detection order configured for Hono's `languageDetector`
// middleware in src/server.ts (cookie, then Accept-Language header), so the
// SSR shell and the API agree on locale without a network round trip.
export function detectLocale(request: Request): Locale {
  const cookieLocale = readCookie(request.headers.get('cookie'), LOCALE_COOKIE_NAME)
  if (isSupportedLocale(cookieLocale)) return cookieLocale

  const acceptLanguage = request.headers.get('accept-language')
  const preferred = acceptLanguage?.split(',')[0]?.split('-')[0]?.trim()
  if (isSupportedLocale(preferred)) return preferred

  return DEFAULT_LOCALE
}

function readCookie(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null

  for (const part of cookieHeader.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }

  return null
}
