import { Hono } from 'hono'
import { requireAuth } from '#/server/auth/auth'
import type { AuthEnv } from '#/server/auth/auth'
import { requirePermissionRoute } from '#/server/auth/require-permission'
import { createDb } from '#/server/db'
import {
  createContactSubmission,
  deleteContactSubmission,
  getContactSubmissionById,
  listContactSubmissions,
} from '#/server/services/contact'

/**
 * Mirrors `src/server/actions/contact.ts` 1:1. `POST /` deliberately stays
 * public — it mirrors `createContactSubmissionFn`, which has no
 * `authMiddleware` so anyone can submit the contact form.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const app = new Hono<AuthEnv>()

function parseId(idParam: string) {
  const id = Number(idParam)
  return Number.isInteger(id) ? id : undefined
}

app.post('/', async (c) => {
  const body = await c.req.json<{
    name?: string
    email?: string
    message?: string
  }>()

  if (!body.name || !body.email || !body.message) {
    return c.json({ error: 'name, email, and message are required' }, 400)
  }
  if (!EMAIL_PATTERN.test(body.email)) {
    return c.json({ error: 'invalid email address' }, 400)
  }

  const db = createDb(c.env.DB)
  const row = await createContactSubmission(db, {
    name: body.name,
    email: body.email,
    message: body.message,
  })

  return c.json(row, 201)
})

app.get(
  '/',
  requireAuth,
  requirePermissionRoute({ contact: ['read'] }),
  async (c) => {
    const db = createDb(c.env.DB)
    const { contactSubmissions } = await listContactSubmissions(db, {
      limit: Number.MAX_SAFE_INTEGER,
      offset: 0,
    })
    return c.json(contactSubmissions)
  },
)

app.get(
  '/:id',
  requireAuth,
  requirePermissionRoute({ contact: ['read'] }),
  async (c) => {
    const id = parseId(c.req.param('id'))
    if (id === undefined) {
      return c.json({ error: 'invalid id' }, 400)
    }

    const db = createDb(c.env.DB)
    const row = await getContactSubmissionById(db, id)
    if (!row) {
      return c.json({ error: 'contact submission not found' }, 404)
    }

    return c.json(row)
  },
)

app.delete(
  '/:id',
  requireAuth,
  requirePermissionRoute({ contact: ['delete'] }),
  async (c) => {
    const id = parseId(c.req.param('id'))
    if (id === undefined) {
      return c.json({ error: 'invalid id' }, 400)
    }

    const db = createDb(c.env.DB)
    const row = await deleteContactSubmission(db, id)
    if (!row) {
      return c.json({ error: 'contact submission not found' }, 404)
    }

    return c.json(row)
  },
)

export default app
