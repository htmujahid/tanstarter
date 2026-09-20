import { z } from '@hono/zod-openapi'

export const ErrorSchema = z.object({ error: z.string() }).openapi('Error')

export function errorResponse(description: string) {
  return {
    description,
    content: { 'application/json': { schema: ErrorSchema } },
  }
}

export function jsonResponse<T extends z.ZodTypeAny>(
  schema: T,
  description: string,
) {
  return {
    description,
    content: { 'application/json': { schema } },
  }
}
