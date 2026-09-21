import { createRoute } from '@hono/zod-openapi'

import { createDb } from '#/server/db'
import { createAuthOpenApiApp } from '#/server/openapi/factory'
import {
  ContactSubmissionSchema,
  CreateContactSubmissionSchema,
} from '#/server/openapi/models/contact.model'
import { errorResponse, jsonResponse } from '#/server/openapi/responses'
import { createContactSubmission } from '#/server/services/contact.service'

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

export default app
