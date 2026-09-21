import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import { DEFAULT_LOCALE } from '#/lib/i18n/config'
import type { Locale } from '#/lib/i18n/config'
import { resources } from '#/lib/i18n/resources'

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
