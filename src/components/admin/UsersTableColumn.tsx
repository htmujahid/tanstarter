import { Link } from '@tanstack/react-router'
import {
  createColumnHelper,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/react-table'
import { ActionIcon, Badge, Menu, Text, UnstyledButton } from '@mantine/core'
import {
  IconBan,
  IconChevronDown,
  IconChevronUp,
  IconDots,
  IconEye,
  IconSelector,
  IconTrash,
  IconUserCheck,
  IconUserShield,
} from '@tabler/icons-react'
import type { Session } from '#/server/auth/auth'

export type AdminUser = NonNullable<Session>['user']

export const SORTABLE_FIELDS = ['name', 'role', 'banned', 'createdAt'] as const
export type SortableField = (typeof SORTABLE_FIELDS)[number]

export const usersTableFeatures = tableFeatures({ rowSortingFeature })

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

export function getUsersTableColumns({
  currentUserId,
  pendingId,
  onView,
  onImpersonate,
  onBan,
  onUnban,
  onDelete,
}: {
  currentUserId: string
  pendingId: string | null
  onView: (user: AdminUser) => void
  onImpersonate: (user: AdminUser) => void
  onBan: (user: AdminUser) => void
  onUnban: (user: AdminUser) => void
  onDelete: (user: AdminUser) => void
}) {
  return columnHelper.columns([
    columnHelper.accessor('name', {
      header: ({ column }) => <SortableHeader label="User" column={column} />,
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
      header: ({ column }) => <SortableHeader label="Role" column={column} />,
      cell: ({ getValue }) => {
        const role = getValue() ?? 'user'
        return (
          <Badge color={role === 'admin' ? 'grape' : 'gray'} variant="light">
            {role}
          </Badge>
        )
      },
    }),
    columnHelper.accessor('banned', {
      header: ({ column }) => <SortableHeader label="Status" column={column} />,
      cell: ({ getValue }) => {
        const isBanned = Boolean(getValue())
        return (
          <Badge color={isBanned ? 'red' : 'teal'} variant="light">
            {isBanned ? 'Banned' : 'Active'}
          </Badge>
        )
      },
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => <SortableHeader label="Joined" column={column} />,
      cell: ({ getValue }) => (
        <Text size="sm" c="dimmed">
          {new Date(getValue()).toLocaleDateString()}
        </Text>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row }) => {
        const user = row.original
        const isSelf = user.id === currentUserId
        const isBanned = Boolean(user.banned)

        return (
          <Menu position="bottom-end" shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                loading={pendingId === user.id}
              >
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEye size={16} />}
                onClick={() => onView(user)}
              >
                View details
              </Menu.Item>

              {!isSelf && (
                <Menu.Item
                  leftSection={<IconUserShield size={16} />}
                  onClick={() => onImpersonate(user)}
                >
                  Impersonate
                </Menu.Item>
              )}

              {!isSelf &&
                (isBanned ? (
                  <Menu.Item
                    leftSection={<IconUserCheck size={16} />}
                    onClick={() => onUnban(user)}
                  >
                    Unban
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    leftSection={<IconBan size={16} />}
                    onClick={() => onBan(user)}
                  >
                    Ban
                  </Menu.Item>
                ))}

              {!isSelf && (
                <>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    leftSection={<IconTrash size={16} />}
                    onClick={() => onDelete(user)}
                  >
                    Delete
                  </Menu.Item>
                </>
              )}
            </Menu.Dropdown>
          </Menu>
        )
      },
    }),
  ])
}
