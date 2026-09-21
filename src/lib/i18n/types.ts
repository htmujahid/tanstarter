import type { Translations } from '#/lib/i18n/locales/types'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: Translations
  }
}
