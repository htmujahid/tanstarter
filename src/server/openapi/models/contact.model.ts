import { z } from '@hono/zod-openapi'

export const ContactSubmissionSchema = z
  .object({
    id: z.number().int(),
    name: z.string(),
    email: z.string(),
    message: z.string(),
    createdAt: z.string(),
  })
  .openapi('ContactSubmission')

export const ContactSubmissionListSchema = z
  .array(ContactSubmissionSchema)
  .openapi('ContactSubmissionList')

export const CreateContactSubmissionSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().optional(),
    message: z.string().optional(),
  })
  .openapi('CreateContactSubmissionRequest')
