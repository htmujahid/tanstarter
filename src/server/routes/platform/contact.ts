import { createRoute } from '@hono/zod-openapi'
import { requireAuth } from '#/server/auth/auth'
import { requirePermissionRoute } from '#/server/auth/require-permission'
import { createDb } from '#/server/db'
import { createAuthOpenApiApp } from '#/server/openapi/factory'
import { idParam, idParamHook } from '#/server/openapi/params'
import { errorResponse, jsonResponse } from '#/server/openapi/responses'
import {
  ContactSubmissionListSchema,
  ContactSubmissionSchema,
  CreateContactSubmissionSchema,
} from '#/server/openapi/models/contact'
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

const app = createAuthOpenApiApp()

app.openapi(
  createRoute({
    method: 'post',
    path: '/',
    tags: ['Contact'],
    security: [],
    request: {
      body: {
        content: {
          'application/json': { schema: CreateContactSubmissionSchema },
        },
      },
    },
    responses: {
      201: jsonResponse(ContactSubmissionSchema, 'Created contact submission'),
      400: errorResponse('Missing fields or invalid email address'),
    },
  }),
  async (c) => {
    const body = c.req.valid('json')

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
  },
)

app.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Contact'],
    middleware: [
      requireAuth,
      requirePermissionRoute({ contact: ['read'] }),
    ] as const,
    responses: {
      200: jsonResponse(
        ContactSubmissionListSchema,
        'List of contact submissions',
      ),
    },
  }),
  async (c) => {
    const db = createDb(c.env.DB)
    const { contactSubmissions } = await listContactSubmissions(db, {
      limit: Number.MAX_SAFE_INTEGER,
      offset: 0,
    })
    return c.json(contactSubmissions, 200)
  },
)

app.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    tags: ['Contact'],
    middleware: [
      requireAuth,
      requirePermissionRoute({ contact: ['read'] }),
    ] as const,
    request: { params: idParam },
    responses: {
      200: jsonResponse(ContactSubmissionSchema, 'A single contact submission'),
      400: errorResponse('Invalid id'),
      404: errorResponse('Contact submission not found'),
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param')
    const db = createDb(c.env.DB)
    const row = await getContactSubmissionById(db, id)
    if (!row) {
      return c.json({ error: 'contact submission not found' }, 404)
    }
    return c.json(row, 200)
  },
  idParamHook,
)

app.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    tags: ['Contact'],
    middleware: [
      requireAuth,
      requirePermissionRoute({ contact: ['delete'] }),
    ] as const,
    request: { params: idParam },
    responses: {
      200: jsonResponse(ContactSubmissionSchema, 'Deleted contact submission'),
      400: errorResponse('Invalid id'),
      404: errorResponse('Contact submission not found'),
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param')
    const db = createDb(c.env.DB)
    const row = await deleteContactSubmission(db, id)
    if (!row) {
      return c.json({ error: 'contact submission not found' }, 404)
    }
    return c.json(row, 200)
  },
  idParamHook,
)

export default app
