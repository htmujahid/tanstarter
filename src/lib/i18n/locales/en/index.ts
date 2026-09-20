import { common } from '#/lib/i18n/locales/en/common'
import { auth } from '#/lib/i18n/locales/en/auth'
import { site } from '#/lib/i18n/locales/en/site'
import { home } from '#/lib/i18n/locales/en/home'
import { profile } from '#/lib/i18n/locales/en/profile'
import { admin } from '#/lib/i18n/locales/en/admin'
import type { Translations } from '#/lib/i18n/locales/types'

// One key per i18next namespace. Shape is defined once in locales/types.ts;
// this just assembles this locale's values against it.
export const en: Translations = {
  common,
  auth,
  site,
  home,
  profile,
  admin,
}
