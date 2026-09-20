import { z } from '@hono/zod-openapi'
import { FEEDBACK_CATEGORIES, FEEDBACK_STATUSES } from '#/server/db/schemas'

/** Documentation-only enums for response fields — request bodies stay
 * loose strings so the handler's own `.includes()` checks keep producing
 * their exact legacy error strings (see platform/feedback.ts). */
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
