import { Hono } from 'hono'
import { createDb } from '#/server/db'
import {
  createNote,
  deleteNote,
  getNoteById,
  listNotes,
  updateNote,
} from '#/server/services/notes'

const app = new Hono<{ Bindings: Env }>()

function parseId(idParam: string) {
  const id = Number(idParam)
  return Number.isInteger(id) ? id : undefined
}

app.get('/', async (c) => {
  const db = createDb(c.env.DB)
  const all = await listNotes(db)
  return c.json(all)
})

app.get('/:id', async (c) => {
  const id = parseId(c.req.param('id'))
  if (id === undefined) {
    return c.json({ error: 'invalid id' }, 400)
  }

  const db = createDb(c.env.DB)
  const note = await getNoteById(db, id)
  if (!note) {
    return c.json({ error: 'note not found' }, 404)
  }

  return c.json(note)
})

app.post('/', async (c) => {
  const body = await c.req.json<{ title?: string; body?: string }>()

  if (!body.title) {
    return c.json({ error: 'title is required' }, 400)
  }

  const db = createDb(c.env.DB)
  const note = await createNote(db, { title: body.title, body: body.body })

  return c.json(note, 201)
})

app.patch('/:id', async (c) => {
  const id = parseId(c.req.param('id'))
  if (id === undefined) {
    return c.json({ error: 'invalid id' }, 400)
  }

  const body = await c.req.json<{ title?: string; body?: string }>()

  const db = createDb(c.env.DB)
  const note = await updateNote(db, id, body)
  if (!note) {
    return c.json({ error: 'note not found' }, 404)
  }

  return c.json(note)
})

app.delete('/:id', async (c) => {
  const id = parseId(c.req.param('id'))
  if (id === undefined) {
    return c.json({ error: 'invalid id' }, 400)
  }

  const db = createDb(c.env.DB)
  const note = await deleteNote(db, id)
  if (!note) {
    return c.json({ error: 'note not found' }, 404)
  }

  return c.json(note)
})

export default app
