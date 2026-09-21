import { createServerFn } from '@tanstack/react-start'

import { authMiddleware } from '#/server/auth/middleware'
import { requirePermission } from '#/server/auth/require-permission'
import { getDb } from '#/server/db'
import {
  createContactSubmission,
  deleteContactSubmission,
  getContactSubmissionById,
  listContactSubmissions,
} from '#/server/services/contact.service'
import type {
  CreateContactSubmissionInput,
  ListContactSubmissionsInput,
} from '#/server/services/contact.service'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const createContactSubmissionFn = createServerFn({ method: 'POST' })
  .validator((data: CreateContactSubmissionInput) => {
    if (!data.name || !data.email || !data.message) {
      throw new Error('name, email, and message are required')
    }
    if (!EMAIL_PATTERN.test(data.email)) {
      throw new Error('Please enter a valid email address')
    }
    return data
  })
  .handler(async ({ data }) => {
    return createContactSubmission(getDb(), data)
  })

export const listContactSubmissionsFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator((data: ListContactSubmissionsInput) => data)
  .handler(async ({ data, context }) => {
    await requirePermission(context.user.role, { contact: ['read'] })
    return listContactSubmissions(getDb(), data)
  })

export const getContactSubmissionFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator((data: { id: number }) => data)
  .handler(async ({ data, context }) => {
    await requirePermission(context.user.role, { contact: ['read'] })
    const row = await getContactSubmissionById(getDb(), data.id)

    if (!row) {
      throw new Error('Contact submission not found')
    }

    return row
  })

export const deleteContactSubmissionFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: { id: number }) => data)
  .handler(async ({ data, context }) => {
    await requirePermission(context.user.role, { contact: ['delete'] })
    return deleteContactSubmission(getDb(), data.id)
  })
