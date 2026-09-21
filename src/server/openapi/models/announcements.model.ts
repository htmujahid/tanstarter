import { z } from '@hono/zod-openapi'

export const AnnouncementSchema = z
  .object({
    id: z.number().int(),
    title: z.string(),
    body: z.string().nullable(),
    published: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi('Announcement')

export const AnnouncementListSchema = z
  .array(AnnouncementSchema)
  .openapi('AnnouncementList')

export const CreateAnnouncementSchema = z
  .object({
    title: z.string().optional(),
    body: z.string().optional(),
    published: z.boolean().optional(),
  })
  .openapi('CreateAnnouncementRequest')

export const UpdateAnnouncementSchema = z
  .object({
    title: z.string().optional(),
    body: z.string().optional(),
    published: z.boolean().optional(),
  })
  .openapi('UpdateAnnouncementRequest')
