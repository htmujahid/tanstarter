import {
  createCollection,
  localStorageCollectionOptions,
} from '@tanstack/react-db'
import { z } from 'zod'

const contactDraftSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  message: z.string(),
})

export type ContactDraft = z.infer<typeof contactDraftSchema>

export const contactDraftCollection = createCollection(
  localStorageCollectionOptions({
    id: 'contact-form-draft',
    storageKey: 'contact-form-draft',
    getKey: (draft) => draft.id,
    schema: contactDraftSchema,
  }),
)
