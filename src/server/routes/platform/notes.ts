import { Hono } from 'hono'
import { requireAuth } from '#/server/auth/auth'
import type { AuthEnv } from '#/server/auth/auth'
import { requirePermissionRoute } from '#/server/auth/require-permission'
import { createDb } from '#/server/db'
import {
  createNote,
  deleteNote,
  getNoteById,
  listNotes,
  updateNote,
} from '#/server/services/notes'

/** Mirrors `src/server/actions/notes.ts` 1:1. */

const app = new Hono<AuthEnv>()

app.use(requireAuth)

function parseId(idParam: string) {
  const id = Number(idParam)
  return Number.isInteger(id) ? id : undefined
}

app.get('/', requirePermissionRoute({ notes: ['read'] }), async (c) => {
  const { user } = c.var.session!
  const db = createDb(c.env.DB)
  const { notes: all } = await listNotes(db, {
    userId: user.id,
    limit: Number.MAX_SAFE_INTEGER,
    offset: 0,
  })
  return c.json(all)
})

app.get('/:id', requirePermissionRoute({ notes: ['read'] }), async (c) => {
  const id = parseId(c.req.param('id'))
  if (id === undefined) {
    return c.json({ error: 'invalid id' }, 400)
  }

  const { user } = c.var.session!
  const db = createDb(c.env.DB)
  const note = await getNoteById(db, id, user.id)
  if (!note) {
    return c.json({ error: 'note not found' }, 404)
  }

  return c.json(note)
})

app.post('/', requirePermissionRoute({ notes: ['create'] }), async (c) => {
  const body = await c.req.json<{ title?: string; body?: string }>()

  if (!body.title) {
    return c.json({ error: 'title is required' }, 400)
  }

  const { user } = c.var.session!
  const db = createDb(c.env.DB)
  const note = await createNote(db, user.id, {
    title: body.title,
    body: body.body,
  })

  return c.json(note, 201)
})

app.patch('/:id', requirePermissionRoute({ notes: ['update'] }), async (c) => {
  const id = parseId(c.req.param('id'))
  if (id === undefined) {
    return c.json({ error: 'invalid id' }, 400)
  }

  const body = await c.req.json<{ title?: string; body?: string }>()

  const { user } = c.var.session!
  const db = createDb(c.env.DB)
  const note = await updateNote(db, id, user.id, body)
  if (!note) {
    return c.json({ error: 'note not found' }, 404)
  }

  return c.json(note)
})

app.delete('/:id', requirePermissionRoute({ notes: ['delete'] }), async (c) => {
  const id = parseId(c.req.param('id'))
  if (id === undefined) {
    return c.json({ error: 'invalid id' }, 400)
  }

  const { user } = c.var.session!
  const db = createDb(c.env.DB)
  const note = await deleteNote(db, id, user.id)
  if (!note) {
    return c.json({ error: 'note not found' }, 404)
  }

  return c.json(note)
})

export default app
