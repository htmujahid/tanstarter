import { z } from '@hono/zod-openapi'

import { FEEDBACK_CATEGORIES, FEEDBACK_STATUSES } from '#/server/db/schemas'

export const FeedbackCategorySchema = z
  .enum(FEEDBACK_CATEGORIES)
  .openapi('FeedbackCategory')
export const FeedbackStatusSchema = z
  .enum(FEEDBACK_STATUSES)
  .openapi('FeedbackStatus')

export const FeedbackSchema = z
  .object({
    id: z.number().int(),
    userId: z.string(),
    category: z.string(),
    message: z.string(),
    status: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi('Feedback')

export const FeedbackListSchema = z
  .array(FeedbackSchema)
  .openapi('FeedbackList')

export const CreateFeedbackSchema = z
  .object({
    category: z.string().optional(),
    message: z.string().optional(),
  })
  .openapi('CreateFeedbackRequest')

export const UpdateFeedbackStatusSchema = z
  .object({
    status: z.string().optional(),
  })
  .openapi('UpdateFeedbackStatusRequest')
