import { z } from '@hono/zod-openapi'

export const NoteSchema = z
  .object({
    id: z.number().int(),
    title: z.string(),
    body: z.string().nullable(),
    userId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi('Note')

export const NoteListSchema = z.array(NoteSchema).openapi('NoteList')

export const CreateNoteSchema = z
  .object({
    title: z.string().optional(),
    body: z.string().optional(),
  })
  .openapi('CreateNoteRequest')

export const UpdateNoteSchema = z
  .object({
    title: z.string().optional(),
    body: z.string().optional(),
  })
  .openapi('UpdateNoteRequest')
