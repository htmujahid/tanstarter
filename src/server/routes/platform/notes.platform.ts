import { createRoute } from '@hono/zod-openapi'
import { requireAuth } from '#/server/auth/auth'
import { requirePermissionRoute } from '#/server/auth/require-permission'
import { createDb } from '#/server/db'
import { createAuthOpenApiApp } from '#/server/openapi/factory'
import { idParam, idParamHook } from '#/server/openapi/params'
import { errorResponse, jsonResponse } from '#/server/openapi/responses'
import {
  CreateNoteSchema,
  NoteListSchema,
  NoteSchema,
  UpdateNoteSchema,
} from '#/server/openapi/models/notes.model'
import {
  createNote,
  deleteNote,
  getNoteById,
  listNotes,
  updateNote,
} from '#/server/services/notes.service'

/** Mirrors `src/server/actions/notes.ts` 1:1. */

const app = createAuthOpenApiApp()

app.use(requireAuth)

app.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Notes'],
    middleware: [requirePermissionRoute({ notes: ['read'] })] as const,
    responses: { 200: jsonResponse(NoteListSchema, 'List of notes') },
  }),
  async (c) => {
    const { user } = c.var.session!
    const db = createDb(c.env.DB)
    const { notes: all } = await listNotes(db, {
      userId: user.id,
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
    tags: ['Notes'],
    middleware: [requirePermissionRoute({ notes: ['read'] })] as const,
    request: { params: idParam },
    responses: {
      200: jsonResponse(NoteSchema, 'A single note'),
      400: errorResponse('Invalid id'),
      404: errorResponse('Note not found'),
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param')
    const { user } = c.var.session!
    const db = createDb(c.env.DB)
    const note = await getNoteById(db, id, user.id)
    if (!note) {
      return c.json({ error: 'note not found' }, 404)
    }
    return c.json(note, 200)
  },
  idParamHook,
)

app.openapi(
  createRoute({
    method: 'post',
    path: '/',
    tags: ['Notes'],
    middleware: [requirePermissionRoute({ notes: ['create'] })] as const,
    request: {
      body: { content: { 'application/json': { schema: CreateNoteSchema } } },
    },
    responses: {
      201: jsonResponse(NoteSchema, 'Created note'),
      400: errorResponse('title is required'),
    },
  }),
  async (c) => {
    const body = c.req.valid('json')

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
  },
)

app.openapi(
  createRoute({
    method: 'patch',
    path: '/{id}',
    tags: ['Notes'],
    middleware: [requirePermissionRoute({ notes: ['update'] })] as const,
    request: {
      params: idParam,
      body: { content: { 'application/json': { schema: UpdateNoteSchema } } },
    },
    responses: {
      200: jsonResponse(NoteSchema, 'Updated note'),
      400: errorResponse('Invalid id'),
      404: errorResponse('Note not found'),
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param')
    const body = c.req.valid('json')

    const { user } = c.var.session!
    const db = createDb(c.env.DB)
    const note = await updateNote(db, id, user.id, body)
    if (!note) {
      return c.json({ error: 'note not found' }, 404)
    }

    return c.json(note, 200)
  },
  idParamHook,
)

app.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    tags: ['Notes'],
    middleware: [requirePermissionRoute({ notes: ['delete'] })] as const,
    request: { params: idParam },
    responses: {
      200: jsonResponse(NoteSchema, 'Deleted note'),
      400: errorResponse('Invalid id'),
      404: errorResponse('Note not found'),
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param')
    const { user } = c.var.session!
    const db = createDb(c.env.DB)
    const note = await deleteNote(db, id, user.id)
    if (!note) {
      return c.json({ error: 'note not found' }, 404)
    }
    return c.json(note, 200)
  },
  idParamHook,
)

export default app
