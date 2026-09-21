import { createRoute } from '@hono/zod-openapi'

import { requireAuth } from '#/server/auth/auth'
import { createDb } from '#/server/db'
import { FEEDBACK_CATEGORIES } from '#/server/db/schemas'
import { createAuthOpenApiApp } from '#/server/openapi/factory'
import {
  CreateFeedbackSchema,
  FeedbackListSchema,
  FeedbackSchema,
} from '#/server/openapi/models/feedback.model'
import { idParam, idParamHook } from '#/server/openapi/params'
import { errorResponse, jsonResponse } from '#/server/openapi/responses'
import {
  createFeedback,
  getFeedbackById,
  listFeedback,
} from '#/server/services/feedback.service'

const app = createAuthOpenApiApp()

app.use(requireAuth)

app.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Feedback'],
    responses: {
      200: jsonResponse(FeedbackListSchema, "List of the caller's feedback"),
    },
  }),
  async (c) => {
    const { user } = c.var.session!
    const db = createDb(c.env.DB)
    const { feedback: all } = await listFeedback(db, {
      scopeToUserId: user.id,
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
    const row = await getFeedbackById(db, id, { scopeToUserId: user.id })
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

export default app
