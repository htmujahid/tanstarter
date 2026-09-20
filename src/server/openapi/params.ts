import { z } from '@hono/zod-openapi'

/**
 * Replicates every route file's hand-rolled `parseId` exactly:
 * `Number.isInteger(Number(str))` — accepts "1", "1.0" (→1), "1e2" (→100);
 * rejects "", "abc", "1.5".
 */
export const idParam = z.object({
  id: z
    .string()
    .refine((v) => Number.isInteger(Number(v)), { message: 'invalid id' })
    .transform((v) => Number(v))
    .openapi({ param: { name: 'id', in: 'path' }, example: '1' }),
})

/**
 * Deliberately untyped (`any`) rather than annotated with `Hook<...>`:
 * an explicit generic-instantiated `Hook` type here would pin the input
 * type parameter for every `.openapi()` call this is passed to, collapsing
 * `c.req.valid()`'s inferred type to that fixed instantiation instead of
 * letting it be inferred per-route from `createRoute()`.
 *
 * Checks `result.target` because PATCH routes validate both `params` (this
 * schema) and `body` in the same call — a body-shape failure must not be
 * misreported as `'invalid id'`; it falls through to the generic
 * `openApiErrorHook`-style response instead.
 */
export const idParamHook = (result: any, c: any) => {
  if (!result.success) {
    if (result.target === 'param') {
      return c.json({ error: 'invalid id' }, 400)
    }
    return c.json({ error: 'invalid request' }, 400)
  }
}
