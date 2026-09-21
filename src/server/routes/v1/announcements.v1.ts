import { createRoute } from '@hono/zod-openapi'
import { createDb } from '#/server/db'
import { createAuthOpenApiApp } from '#/server/openapi/factory'
import { idParam, idParamHook } from '#/server/openapi/params'
import { errorResponse, jsonResponse } from '#/server/openapi/responses'
import {
  AnnouncementListSchema,
  AnnouncementSchema,
} from '#/server/openapi/models/announcements.model'
import { getAnnouncementById, listAnnouncements } from '#/server/services/announcements.service'

const app = createAuthOpenApiApp()

// Public: no auth required. Only published announcements are visible.
app.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Announcements'],
    security: [],
    responses: {
      200: jsonResponse(
        AnnouncementListSchema,
        'List of published announcements',
      ),
    },
  }),
  async (c) => {
    const db = createDb(c.env.DB)
    const { announcements: all } = await listAnnouncements(db, {
      onlyPublished: true,
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
    tags: ['Announcements'],
    security: [],
    request: { params: idParam },
    responses: {
      200: jsonResponse(AnnouncementSchema, 'A single published announcement'),
      400: errorResponse('Invalid id'),
      404: errorResponse('Announcement not found'),
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param')
    const db = createDb(c.env.DB)
    const announcement = await getAnnouncementById(db, id, {
      onlyPublished: true,
    })
    if (!announcement) {
      return c.json({ error: 'announcement not found' }, 404)
    }
    return c.json(announcement, 200)
  },
  idParamHook,
)

export default app
