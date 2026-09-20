import { z } from '@hono/zod-openapi'

/** Owned by this app — mirrors `getUserStats`. */
export const AdminStatsSchema = z
  .object({
    total: z.number().int(),
    admins: z.number().int(),
    banned: z.number().int(),
  })
  .openapi('AdminStats')

/** NOT owned by this app — shape belongs to better-auth's own plugins
 * (admin/api-key/passkey/session). The authoritative schema is documented
 * at /api/auth via the `openAPI()` plugin, which introspects those plugins
 * directly, so these stay deliberately loose passthroughs. */
export const BetterAuthPassthroughSchema = z
  .record(z.string(), z.unknown())
  .openapi('BetterAuthObject', {
    description:
      'Shape owned by better-auth; see /api/auth for the authoritative schema.',
  })

export const BetterAuthPassthroughListSchema = z
  .array(z.record(z.string(), z.unknown()))
  .openapi('BetterAuthObjectList', {
    description:
      'Shape owned by better-auth; see /api/auth for the authoritative schema.',
  })
