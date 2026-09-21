import {
  DEFAULT_LOCALE,
  isSupportedLocale,
  LOCALE_COOKIE_NAME,
} from '#/lib/i18n/config'
import type { Locale } from '#/lib/i18n/config'

export function detectLocale(request: Request): Locale {
  const cookieLocale = readCookie(
    request.headers.get('cookie'),
    LOCALE_COOKIE_NAME,
  )
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
