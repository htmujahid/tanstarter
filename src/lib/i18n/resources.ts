import { en } from '#/lib/i18n/locales/en'
import { ur } from '#/lib/i18n/locales/ur'
import type { Resource } from 'i18next'

// i18next's `Resource` type wants an index signature that our precisely
// keyed `Translations` interface (locales/types.ts, deliberately) doesn't
// have. The real type safety is enforced where each locale's `const x:
// XTranslations = {...}` is defined, plus this package's types.ts
// `CustomTypeOptions` augmentation for `t()` — this cast just satisfies
// i18next's looser runtime-facing shape.
export const resources = { en, ur } as unknown as Resource
