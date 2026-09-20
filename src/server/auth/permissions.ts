import { createAccessControl } from 'better-auth/plugins/access'
import {
  adminAc,
  defaultStatements,
  userAc,
} from 'better-auth/plugins/admin/access'

const statement = {
  ...defaultStatements,
  notes: ['create', 'read', 'update', 'delete'],
  announcements: ['create', 'read', 'update', 'delete'],
  feedback: ['create', 'read', 'update', 'delete'],
  contact: ['read', 'delete'],
} as const

export const ac = createAccessControl(statement)

export const admin = ac.newRole({
  ...adminAc.statements,
  notes: ['create', 'read', 'update', 'delete'],
  announcements: ['create', 'read', 'update', 'delete'],
  feedback: ['create', 'read', 'update', 'delete'],
  contact: ['read', 'delete'],
})

export const user = ac.newRole({
  ...userAc.statements,
  notes: ['create', 'read', 'update', 'delete'],
  announcements: ['read'],
  feedback: ['create', 'read'],
})

/** A permissions check keyed by resource, e.g. `{ notes: ['create'] }`. */
export type PermissionCheck = {
  [K in keyof typeof statement]?: (typeof statement)[K][number][]
}
