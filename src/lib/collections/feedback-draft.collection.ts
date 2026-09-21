import {
  createCollection,
  localStorageCollectionOptions,
} from '@tanstack/react-db'
import { z } from 'zod'
import { FEEDBACK_CATEGORIES } from '#/server/db/schemas'

const feedbackDraftSchema = z.object({
  id: z.literal('feedback'),
  category: z.enum(FEEDBACK_CATEGORIES),
  message: z.string(),
})

export type FeedbackDraft = z.infer<typeof feedbackDraftSchema>

export const feedbackDraftCollection = createCollection(
  localStorageCollectionOptions({
    id: 'feedback-form-draft',
    storageKey: 'feedback-form-draft',
    getKey: (draft) => draft.id,
    schema: feedbackDraftSchema,
  }),
)
