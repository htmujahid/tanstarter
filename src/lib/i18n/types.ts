import type { Translations } from '#/lib/i18n/locales/types'

// Gives `useTranslation()`/`t()` full autocomplete and compile-time
// key-path checking across every namespace, everywhere in the app. Pure
// type-level augmentation — never imported for its runtime value, just
// needs to be part of the TS program (tsconfig's `**/*.ts` include covers
// it).
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: Translations
  }
}
