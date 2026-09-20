import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '#/server/auth/middleware'
import { requirePermission } from '#/server/auth/require-permission'
import { getDb } from '#/server/db'
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementById,
  listAnnouncements,
  updateAnnouncement,
} from '#/server/services/announcements'
import type {
  CreateAnnouncementInput,
  ListAnnouncementsInput,
  UpdateAnnouncementInput,
} from '#/server/services/announcements'

export const listAnnouncementsFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator((data: Omit<ListAnnouncementsInput, 'onlyPublished'>) => data)
  .handler(async ({ data, context }) => {
    await requirePermission(context.user.role, { announcements: ['read'] })
    return listAnnouncements(getDb(), {
      ...data,
      onlyPublished: context.user.role !== 'admin',
    })
  })

export const getAnnouncementFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator((data: { id: number }) => data)
  .handler(async ({ data, context }) => {
    await requirePermission(context.user.role, { announcements: ['read'] })
    const announcement = await getAnnouncementById(getDb(), data.id, {
      onlyPublished: context.user.role !== 'admin',
    })

    if (!announcement) {
      throw new Error('Announcement not found')
    }

    return announcement
  })

export const createAnnouncementFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: CreateAnnouncementInput) => {
    if (!data.title) {
      throw new Error('title is required')
    }
    return data
  })
  .handler(async ({ data, context }) => {
    await requirePermission(context.user.role, { announcements: ['create'] })
    return createAnnouncement(getDb(), data)
  })

export const updateAnnouncementFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: { id: number } & UpdateAnnouncementInput) => data)
  .handler(async ({ data, context }) => {
    await requirePermission(context.user.role, { announcements: ['update'] })
    const { id, ...input } = data
    return updateAnnouncement(getDb(), id, input)
  })

export const deleteAnnouncementFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: { id: number }) => data)
  .handler(async ({ data, context }) => {
    await requirePermission(context.user.role, { announcements: ['delete'] })
    return deleteAnnouncement(getDb(), data.id)
  })
