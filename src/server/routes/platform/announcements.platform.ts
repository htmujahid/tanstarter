import { createRoute } from '@hono/zod-openapi'
import { requireAuth } from '#/server/auth/auth'
import { requirePermissionRoute } from '#/server/auth/require-permission'
import { createDb } from '#/server/db'
import { createAuthOpenApiApp } from '#/server/openapi/factory'
import { idParam, idParamHook } from '#/server/openapi/params'
import { errorResponse, jsonResponse } from '#/server/openapi/responses'
import {
  AnnouncementListSchema,
  AnnouncementSchema,
  CreateAnnouncementSchema,
  UpdateAnnouncementSchema,
} from '#/server/openapi/models/announcements.model'
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementById,
  listAnnouncements,
  updateAnnouncement,
} from '#/server/services/announcements.service'

/**
 * Mirrors `src/server/actions/announcements.ts`'s authenticated functions
 * 1:1 (listAnnouncementsFn, getAnnouncementFn, create/update/deleteAnnouncementFn).
 * `listPublicAnnouncementsFn`/`getPublicAnnouncementFn` are deliberately not
 * mirrored here — they're already served unauthenticated at
 * `/api/v1/announcements`, and duplicating an identical public contract
 * under this namespace too would be pure redundancy.
 */

const app = createAuthOpenApiApp()

app.use(requireAuth)

app.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Announcements'],
    middleware: [requirePermissionRoute({ announcements: ['read'] })] as const,
    responses: {
      200: jsonResponse(AnnouncementListSchema, 'List of announcements'),
    },
  }),
  async (c) => {
    const db = createDb(c.env.DB)
    const onlyPublished = c.var.session!.user.role !== 'admin'
    const { announcements: all } = await listAnnouncements(db, {
      onlyPublished,
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
    middleware: [requirePermissionRoute({ announcements: ['read'] })] as const,
    request: { params: idParam },
    responses: {
      200: jsonResponse(AnnouncementSchema, 'A single announcement'),
      400: errorResponse('Invalid id'),
      404: errorResponse('Announcement not found'),
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param')
    const db = createDb(c.env.DB)
    const onlyPublished = c.var.session!.user.role !== 'admin'
    const announcement = await getAnnouncementById(db, id, { onlyPublished })
    if (!announcement) {
      return c.json({ error: 'announcement not found' }, 404)
    }
    return c.json(announcement, 200)
  },
  idParamHook,
)

app.openapi(
  createRoute({
    method: 'post',
    path: '/',
    tags: ['Announcements'],
    middleware: [
      requirePermissionRoute({ announcements: ['create'] }),
    ] as const,
    request: {
      body: {
        content: { 'application/json': { schema: CreateAnnouncementSchema } },
      },
    },
    responses: {
      201: jsonResponse(AnnouncementSchema, 'Created announcement'),
      400: errorResponse('title is required'),
    },
  }),
  async (c) => {
    const body = c.req.valid('json')

    if (!body.title) {
      return c.json({ error: 'title is required' }, 400)
    }

    const db = createDb(c.env.DB)
    const announcement = await createAnnouncement(db, {
      title: body.title,
      body: body.body,
      published: body.published,
    })

    return c.json(announcement, 201)
  },
)

app.openapi(
  createRoute({
    method: 'patch',
    path: '/{id}',
    tags: ['Announcements'],
    middleware: [
      requirePermissionRoute({ announcements: ['update'] }),
    ] as const,
    request: {
      params: idParam,
      body: {
        content: { 'application/json': { schema: UpdateAnnouncementSchema } },
      },
    },
    responses: {
      200: jsonResponse(AnnouncementSchema, 'Updated announcement'),
      400: errorResponse('Invalid id'),
      404: errorResponse('Announcement not found'),
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param')
    const body = c.req.valid('json')

    const db = createDb(c.env.DB)
    const announcement = await updateAnnouncement(db, id, body)
    if (!announcement) {
      return c.json({ error: 'announcement not found' }, 404)
    }

    return c.json(announcement, 200)
  },
  idParamHook,
)

app.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    tags: ['Announcements'],
    middleware: [
      requirePermissionRoute({ announcements: ['delete'] }),
    ] as const,
    request: { params: idParam },
    responses: {
      200: jsonResponse(AnnouncementSchema, 'Deleted announcement'),
      400: errorResponse('Invalid id'),
      404: errorResponse('Announcement not found'),
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param')
    const db = createDb(c.env.DB)
    const announcement = await deleteAnnouncement(db, id)
    if (!announcement) {
      return c.json({ error: 'announcement not found' }, 404)
    }
    return c.json(announcement, 200)
  },
  idParamHook,
)

export default app
