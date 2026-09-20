import { createAccessControl } from 'better-auth/plugins/access'
import {
  adminAc,
  defaultStatements,
  userAc,
} from 'better-auth/plugins/admin/access'

const statement = {
  ...defaultStatements,
  notes: ['create', 'read', 'update', 'delete'],
} as const

export const ac = createAccessControl(statement)

export const admin = ac.newRole({
  ...adminAc.statements,
  notes: ['create', 'read', 'update', 'delete'],
})

export const user = ac.newRole({
  ...userAc.statements,
  notes: ['create', 'read', 'update', 'delete'],
})

/** A permissions check keyed by resource, e.g. `{ notes: ['create'] }`. */
export type PermissionCheck = {
  [K in keyof typeof statement]?: (typeof statement)[K][number][]
}
