import { Hono } from 'hono'
import { requireAuth } from '#/server/auth/auth'
import type { AuthEnv } from '#/server/auth/auth'
import { requirePermissionRoute } from '#/server/auth/require-permission'
import { createDb } from '#/server/db'
import {
  createFeedback,
  deleteFeedback,
  getFeedbackById,
  listFeedback,
  updateFeedbackStatus,
} from '#/server/services/feedback'
import { FEEDBACK_CATEGORIES, FEEDBACK_STATUSES } from '#/server/db/schemas'

/** Mirrors `src/server/actions/feedback.ts` 1:1. */

const app = new Hono<AuthEnv>()

app.use(requireAuth)

function parseId(idParam: string) {
  const id = Number(idParam)
  return Number.isInteger(id) ? id : undefined
}

app.get('/', requirePermissionRoute({ feedback: ['read'] }), async (c) => {
  const { user } = c.var.session!
  const db = createDb(c.env.DB)
  const { feedback: all } = await listFeedback(db, {
    scopeToUserId: user.role === 'admin' ? undefined : user.id,
    limit: Number.MAX_SAFE_INTEGER,
    offset: 0,
  })
  return c.json(all)
})

app.get('/:id', requirePermissionRoute({ feedback: ['read'] }), async (c) => {
  const id = parseId(c.req.param('id'))
  if (id === undefined) {
    return c.json({ error: 'invalid id' }, 400)
  }

  const { user } = c.var.session!
  const db = createDb(c.env.DB)
  const row = await getFeedbackById(db, id, {
    scopeToUserId: user.role === 'admin' ? undefined : user.id,
  })
  if (!row) {
    return c.json({ error: 'feedback not found' }, 404)
  }

  return c.json(row)
})

app.post('/', requirePermissionRoute({ feedback: ['create'] }), async (c) => {
  const body = await c.req.json<{ category?: string; message?: string }>()

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
})

app.patch(
  '/:id',
  requirePermissionRoute({ feedback: ['update'] }),
  async (c) => {
    const id = parseId(c.req.param('id'))
    if (id === undefined) {
      return c.json({ error: 'invalid id' }, 400)
    }

    const body = await c.req.json<{ status?: string }>()
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

    return c.json(row)
  },
)

app.delete(
  '/:id',
  requirePermissionRoute({ feedback: ['delete'] }),
  async (c) => {
    const id = parseId(c.req.param('id'))
    if (id === undefined) {
      return c.json({ error: 'invalid id' }, 400)
    }

    const db = createDb(c.env.DB)
    const row = await deleteFeedback(db, id)
    if (!row) {
      return c.json({ error: 'feedback not found' }, 404)
    }

    return c.json(row)
  },
)

export default app
