export const SUPPORTED_LOCALES = ['en', 'ur'] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

const RTL_LOCALES: readonly Locale[] = ['ur']

export const LOCALE_COOKIE_NAME = 'locale'

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ur: 'اردو',
}

export function isRtl(locale: Locale) {
  return RTL_LOCALES.includes(locale)
}

export function isSupportedLocale(
  value: string | null | undefined,
): value is Locale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value)
}
