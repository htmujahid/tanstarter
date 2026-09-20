import {
  createColumnHelper,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/react-table'
import { Link } from '@tanstack/react-router'
import { Badge, Checkbox, Text, UnstyledButton } from '@mantine/core'
import {
  IconChevronDown,
  IconChevronUp,
  IconSelector,
} from '@tabler/icons-react'
import type { TFunction } from 'i18next'
import type { Session } from '#/server/auth/auth'

export type AdminUser = NonNullable<Session>['user']

export const SORTABLE_FIELDS = ['name', 'role', 'banned', 'createdAt'] as const
export type SortableField = (typeof SORTABLE_FIELDS)[number]

export const usersTableFeatures = tableFeatures({
  rowSortingFeature,
  rowSelectionFeature,
})

const columnHelper = createColumnHelper<typeof usersTableFeatures, AdminUser>()

function SortableHeader({
  label,
  column,
}: {
  label: string
  column: {
    getCanSort: () => boolean
    getIsSorted: () => false | 'asc' | 'desc'
    getToggleSortingHandler: () => undefined | ((event: unknown) => void)
  }
}) {
  if (!column.getCanSort()) return label

  const sorted = column.getIsSorted()

  return (
    <UnstyledButton
      onClick={column.getToggleSortingHandler()}
      className="inline-flex items-center gap-1 text-sm font-semibold"
    >
      {label}
      {sorted === 'asc' ? (
        <IconChevronUp size={14} />
      ) : sorted === 'desc' ? (
        <IconChevronDown size={14} />
      ) : (
        <IconSelector size={14} className="opacity-40" />
      )}
    </UnstyledButton>
  )
}

export function getUsersTableColumns(t: TFunction<'admin'>) {
  return columnHelper.columns([
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          aria-label={t('users.list.table.selectAllAria')}
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            !table.getIsAllPageRowsSelected() &&
            table.getIsSomePageRowsSelected()
          }
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      enableSorting: false,
      cell: ({ row }) => (
        <Checkbox
          aria-label={t('users.list.table.selectRowAria', {
            name: row.original.name,
          })}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    }),
    columnHelper.accessor('name', {
      header: ({ column }) => (
        <SortableHeader label={t('users.list.table.userColumn')} column={column} />
      ),
      cell: ({ row }) => (
        <div>
          <Link
            to="/admin/users/$userId"
            params={{ userId: row.original.id }}
            className="text-sm font-medium hover:underline"
          >
            {row.original.name}
          </Link>
          <Text size="xs" c="dimmed">
            {row.original.email}
          </Text>
        </div>
      ),
    }),
    columnHelper.accessor('role', {
      header: ({ column }) => (
        <SortableHeader label={t('users.list.table.roleColumn')} column={column} />
      ),
      cell: ({ getValue }) => {
        const role = getValue() ?? 'user'
        return (
          <Badge color={role === 'admin' ? 'grape' : 'gray'} variant="light">
            {role === 'admin' ? t('users.roles.admin') : t('users.roles.user')}
          </Badge>
        )
      },
    }),
    columnHelper.accessor('banned', {
      header: ({ column }) => (
        <SortableHeader
          label={t('users.list.table.statusColumn')}
          column={column}
        />
      ),
      cell: ({ getValue }) => {
        const isBanned = Boolean(getValue())
        return (
          <Badge color={isBanned ? 'red' : 'teal'} variant="light">
            {isBanned ? t('users.status.banned') : t('users.status.active')}
          </Badge>
        )
      },
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => (
        <SortableHeader
          label={t('users.list.table.joinedColumn')}
          column={column}
        />
      ),
      cell: ({ getValue }) => (
        <Text size="sm" c="dimmed">
          {new Date(getValue()).toLocaleDateString()}
        </Text>
      ),
    }),
  ])
}
