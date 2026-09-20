import { Hono } from 'hono'
import { requireAuth } from '#/server/auth/auth'
import type { AuthEnv } from '#/server/auth/auth'
import { requirePermissionRoute } from '#/server/auth/require-permission'
import { createDb } from '#/server/db'
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementById,
  listAnnouncements,
  updateAnnouncement,
} from '#/server/services/announcements'

/**
 * Mirrors `src/server/actions/announcements.ts`'s authenticated functions
 * 1:1 (listAnnouncementsFn, getAnnouncementFn, create/update/deleteAnnouncementFn).
 * `listPublicAnnouncementsFn`/`getPublicAnnouncementFn` are deliberately not
 * mirrored here — they're already served unauthenticated at
 * `/api/v1/announcements`, and duplicating an identical public contract
 * under this namespace too would be pure redundancy.
 */

const app = new Hono<AuthEnv>()

app.use(requireAuth)

function parseId(idParam: string) {
  const id = Number(idParam)
  return Number.isInteger(id) ? id : undefined
}

app.get('/', requirePermissionRoute({ announcements: ['read'] }), async (c) => {
  const db = createDb(c.env.DB)
  const onlyPublished = c.var.session!.user.role !== 'admin'
  const { announcements: all } = await listAnnouncements(db, {
    onlyPublished,
    limit: Number.MAX_SAFE_INTEGER,
    offset: 0,
  })
  return c.json(all)
})

app.get(
  '/:id',
  requirePermissionRoute({ announcements: ['read'] }),
  async (c) => {
    const id = parseId(c.req.param('id'))
    if (id === undefined) {
      return c.json({ error: 'invalid id' }, 400)
    }

    const db = createDb(c.env.DB)
    const onlyPublished = c.var.session!.user.role !== 'admin'
    const announcement = await getAnnouncementById(db, id, { onlyPublished })
    if (!announcement) {
      return c.json({ error: 'announcement not found' }, 404)
    }

    return c.json(announcement)
  },
)

app.post(
  '/',
  requirePermissionRoute({ announcements: ['create'] }),
  async (c) => {
    const body = await c.req.json<{
      title?: string
      body?: string
      published?: boolean
    }>()

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

app.patch(
  '/:id',
  requirePermissionRoute({ announcements: ['update'] }),
  async (c) => {
    const id = parseId(c.req.param('id'))
    if (id === undefined) {
      return c.json({ error: 'invalid id' }, 400)
    }

    const body = await c.req.json<{
      title?: string
      body?: string
      published?: boolean
    }>()

    const db = createDb(c.env.DB)
    const announcement = await updateAnnouncement(db, id, body)
    if (!announcement) {
      return c.json({ error: 'announcement not found' }, 404)
    }

    return c.json(announcement)
  },
)

app.delete(
  '/:id',
  requirePermissionRoute({ announcements: ['delete'] }),
  async (c) => {
    const id = parseId(c.req.param('id'))
    if (id === undefined) {
      return c.json({ error: 'invalid id' }, 400)
    }

    const db = createDb(c.env.DB)
    const announcement = await deleteAnnouncement(db, id)
    if (!announcement) {
      return c.json({ error: 'announcement not found' }, 404)
    }

    return c.json(announcement)
  },
)

export default app
