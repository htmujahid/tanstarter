import { IconBolt, IconPalette, IconShieldCheck } from '@tabler/icons-react'

// `id` maps to `common.features.<id>` for title/description (see
// src/lib/i18n/locales/*/common.ts) — this file only owns the icons/order.
export const features = [
  { id: 'trust', icon: IconShieldCheck },
  { id: 'speed', icon: IconBolt },
  { id: 'design', icon: IconPalette },
] as const

