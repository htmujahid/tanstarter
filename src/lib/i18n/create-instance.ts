import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LOCALE } from '#/lib/i18n/config'
import { resources } from '#/lib/i18n/resources'
import type { Locale } from '#/lib/i18n/config'

// A fresh instance per render root, not a shared module-level singleton:
// the SSR entry can serve concurrent requests for different locales on the
// same Cloudflare Workers isolate, and a global `i18next.changeLanguage()`
// would race between them.
export function createI18nInstance(locale: Locale) {
  const instance = i18next.createInstance()

  void instance.use(initReactI18next).init({
    lng: locale,
    fallbackLng: DEFAULT_LOCALE,
    defaultNS: 'common',
    ns: ['common', 'auth', 'site', 'home', 'profile', 'admin'],
    resources,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })

  return instance
}
