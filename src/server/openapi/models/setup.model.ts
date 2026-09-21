import { z } from '@hono/zod-openapi'

export const SetupStatusSchema = z
  .object({ needsSetup: z.boolean() })
  .openapi('SetupStatus')
