import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '#/server/auth/middleware'
import { requirePermission } from '#/server/auth/require-permission'
import { getDb } from '#/server/db'
import {
  createFeedback,
  deleteFeedback,
  getFeedbackById,
  listFeedback,
  updateFeedbackStatus,
} from '#/server/services/feedback'
import type {
  CreateFeedbackInput,
  ListFeedbackInput,
} from '#/server/services/feedback'
import type { FeedbackStatus } from '#/server/db'

export const listFeedbackFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator((data: Omit<ListFeedbackInput, 'scopeToUserId'>) => data)
  .handler(async ({ data, context }) => {
    await requirePermission(context.user.role, { feedback: ['read'] })
    return listFeedback(getDb(), {
      ...data,
      scopeToUserId:
        context.user.role === 'admin' ? undefined : context.user.id,
    })
  })

export const getFeedbackFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator((data: { id: number }) => data)
  .handler(async ({ data, context }) => {
    await requirePermission(context.user.role, { feedback: ['read'] })
    const row = await getFeedbackById(getDb(), data.id, {
      scopeToUserId:
        context.user.role === 'admin' ? undefined : context.user.id,
    })

    if (!row) {
      throw new Error('Feedback not found')
    }

    return row
  })

export const createFeedbackFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: CreateFeedbackInput) => {
    if (!data.message) {
      throw new Error('message is required')
    }
    return data
  })
  .handler(async ({ data, context }) => {
    await requirePermission(context.user.role, { feedback: ['create'] })
    return createFeedback(getDb(), context.user.id, data)
  })

export const updateFeedbackStatusFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: { id: number; status: FeedbackStatus }) => data)
  .handler(async ({ data, context }) => {
    await requirePermission(context.user.role, { feedback: ['update'] })
    return updateFeedbackStatus(getDb(), data.id, data.status)
  })

export const deleteFeedbackFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: { id: number }) => data)
  .handler(async ({ data, context }) => {
    await requirePermission(context.user.role, { feedback: ['delete'] })
    return deleteFeedback(getDb(), data.id)
  })
