import { createRoute } from '@hono/zod-openapi'
import { requireAuth } from '#/server/auth/auth'
import { requirePermissionRoute } from '#/server/auth/require-permission'
import { createDb } from '#/server/db'
import { FEEDBACK_CATEGORIES, FEEDBACK_STATUSES } from '#/server/db/schemas'
import { createAuthOpenApiApp } from '#/server/openapi/factory'
import { idParam, idParamHook } from '#/server/openapi/params'
import { errorResponse, jsonResponse } from '#/server/openapi/responses'
import {
  CreateFeedbackSchema,
  FeedbackListSchema,
  FeedbackSchema,
  UpdateFeedbackStatusSchema,
} from '#/server/openapi/models/feedback'
import {
  createFeedback,
  deleteFeedback,
  getFeedbackById,
  listFeedback,
  updateFeedbackStatus,
} from '#/server/services/feedback'

/** Mirrors `src/server/actions/feedback.ts` 1:1. */

const app = createAuthOpenApiApp()

app.use(requireAuth)

app.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Feedback'],
    middleware: [requirePermissionRoute({ feedback: ['read'] })] as const,
    responses: { 200: jsonResponse(FeedbackListSchema, 'List of feedback') },
  }),
  async (c) => {
    const { user } = c.var.session!
    const db = createDb(c.env.DB)
    const { feedback: all } = await listFeedback(db, {
      scopeToUserId: user.role === 'admin' ? undefined : user.id,
      limit: Number.MAX_SAFE_INTEGER,
      offset: 0,
    })
    return c.json(all, 200)
  },
)

app.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    tags: ['Feedback'],
    middleware: [requirePermissionRoute({ feedback: ['read'] })] as const,
    request: { params: idParam },
    responses: {
      200: jsonResponse(FeedbackSchema, 'A single feedback item'),
      400: errorResponse('Invalid id'),
      404: errorResponse('Feedback not found'),
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param')
    const { user } = c.var.session!
    const db = createDb(c.env.DB)
    const row = await getFeedbackById(db, id, {
      scopeToUserId: user.role === 'admin' ? undefined : user.id,
    })
    if (!row) {
      return c.json({ error: 'feedback not found' }, 404)
    }
    return c.json(row, 200)
  },
  idParamHook,
)

app.openapi(
  createRoute({
    method: 'post',
    path: '/',
    tags: ['Feedback'],
    middleware: [requirePermissionRoute({ feedback: ['create'] })] as const,
    request: {
      body: {
        content: { 'application/json': { schema: CreateFeedbackSchema } },
      },
    },
    responses: {
      201: jsonResponse(FeedbackSchema, 'Created feedback'),
      400: errorResponse('message is required, or invalid category'),
    },
  }),
  async (c) => {
    const body = c.req.valid('json')

    if (!body.message) {
      return c.json({ error: 'message is required' }, 400)
    }
    if (
      body.category !== undefined &&
      !FEEDBACK_CATEGORIES.includes(body.category as never)
    ) {
      return c.json({ error: 'invalid category' }, 400)
    }

    const { user } = c.var.session!
    const db = createDb(c.env.DB)
    const row = await createFeedback(db, user.id, {
      category: (body.category ??
        'general') as (typeof FEEDBACK_CATEGORIES)[number],
      message: body.message,
    })

    return c.json(row, 201)
  },
)

app.openapi(
  createRoute({
    method: 'patch',
    path: '/{id}',
    tags: ['Feedback'],
    middleware: [requirePermissionRoute({ feedback: ['update'] })] as const,
    request: {
      params: idParam,
      body: {
        content: {
          'application/json': { schema: UpdateFeedbackStatusSchema },
        },
      },
    },
    responses: {
      200: jsonResponse(FeedbackSchema, 'Updated feedback'),
      400: errorResponse('a valid status is required'),
      404: errorResponse('Feedback not found'),
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param')
    const body = c.req.valid('json')

    if (!body.status || !FEEDBACK_STATUSES.includes(body.status as never)) {
      return c.json({ error: 'a valid status is required' }, 400)
    }

    const db = createDb(c.env.DB)
    const row = await updateFeedbackStatus(
      db,
      id,
      body.status as (typeof FEEDBACK_STATUSES)[number],
    )
    if (!row) {
      return c.json({ error: 'feedback not found' }, 404)
    }

    return c.json(row, 200)
  },
  idParamHook,
)

app.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    tags: ['Feedback'],
    middleware: [requirePermissionRoute({ feedback: ['delete'] })] as const,
    request: { params: idParam },
    responses: {
      200: jsonResponse(FeedbackSchema, 'Deleted feedback'),
      400: errorResponse('Invalid id'),
      404: errorResponse('Feedback not found'),
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param')
    const db = createDb(c.env.DB)
    const row = await deleteFeedback(db, id)
    if (!row) {
      return c.json({ error: 'feedback not found' }, 404)
    }
    return c.json(row, 200)
  },
  idParamHook,
)

export default app
