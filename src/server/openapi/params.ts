import { z } from '@hono/zod-openapi'

export const idParam = z.object({
  id: z
    .string()
    .refine((v) => Number.isInteger(Number(v)), { message: 'invalid id' })
    .transform((v) => Number(v))
    .openapi({ param: { name: 'id', in: 'path' }, example: '1' }),
})

export const idParamHook = (result: any, c: any) => {
  if (!result.success) {
    if (result.target === 'param') {
      return c.json({ error: 'invalid id' }, 400)
    }
    return c.json({ error: 'invalid request' }, 400)
  }
}
