import { useMemo, useState } from 'react'
import { flexRender, functionalUpdate, useTable } from '@tanstack/react-table'
import type { RowSelectionState, SortingState } from '@tanstack/react-table'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  Button,
  EmptyState,
  Group,
  Pagination,
  Stack,
  Table,
} from '@mantine/core'
import { IconPlus, IconUsers } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { UsersBulkActionBar } from '#/components/admin/users/users-bulk-action-bar'
import { useSession } from '#/hooks/use-session'
import {
  getUsersTableColumns,
  usersTableFeatures,
} from '#/components/admin/users/users-table-column'
import type { SortableField } from '#/components/admin/users/users-table-column'
import { USERS_PAGE_SIZE, usersQueryOptions } from '#/lib/queries/admin.query'

export function UsersTable({
  q,
  role,
  sortBy,
  sortDirection,
  page,
  onSortChange,
  onChanged,
  onAddUser,
  onClearFilters,
  onPageChange,
}: {
  q?: string
  role?: 'admin' | 'user'
  sortBy?: SortableField
  sortDirection?: 'asc' | 'desc'
  page: number
  onSortChange: (sortBy?: string, sortDirection?: 'asc' | 'desc') => void
  onChanged: () => void
  onAddUser: () => void
  onClearFilters: () => void
  onPageChange: (page: number) => void
}) {
  const { t } = useTranslation('admin')
  const session = useSession()
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const {
    data: { users, total },
  } = useSuspenseQuery(
    usersQueryOptions({ q, role, sortBy, sortDirection, page }),
  )
  const totalPages = Math.max(1, Math.ceil(total / USERS_PAGE_SIZE))
  const hasFilters = Boolean(q || role)

  const columns = useMemo(() => getUsersTableColumns(t), [t])

  const sorting: SortingState = sortBy
    ? [{ id: sortBy, desc: sortDirection === 'desc' }]
    : []

  const table = useTable({
    features: usersTableFeatures,
    data: users,
    columns,
    getRowId: (user) => user.id,
    manualSorting: true,
    enableMultiSort: false,
    enableRowSelection: (row) => row.original.id !== session?.user.id,
    state: { sorting, rowSelection },
    onSortingChange: (updater) => {
      const next = functionalUpdate(updater, sorting)
      const nextSort = next.at(0)
      onSortChange(
        nextSort?.id,
        nextSort ? (nextSort.desc ? 'desc' : 'asc') : undefined,
      )
    },
    onRowSelectionChange: setRowSelection,
  })

  const selectedUsers = table.getSelectedRowModel().rows.map((r) => r.original)

  return (
    <Stack gap="md">
      <Table.ScrollContainer minWidth={640}>
        <Table verticalSpacing="sm" withTableBorder highlightOnHover>
          <Table.Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.Th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}
          </Table.Thead>
          <Table.Tbody>
            {users.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length}>
                  <EmptyState
                    icon={<IconUsers size={28} />}
                    withIndicatorBackground
                    title={
                      hasFilters
                        ? t('users.list.emptyState.noResultsTitle')
                        : t('users.list.emptyState.noUsersTitle')
                    }
                    description={
                      hasFilters
                        ? t('users.list.emptyState.noResultsDescription')
                        : t('users.list.emptyState.noUsersDescription')
                    }
                  >
                    <EmptyState.Actions>
                      {hasFilters ? (
                        <Button variant="default" onClick={onClearFilters}>
                          {t('users.list.emptyState.clearFiltersButton')}
                        </Button>
                      ) : (
                        <Button
                          leftSection={<IconPlus size={16} />}
                          onClick={onAddUser}
                        >
                          {t('users.list.addUserButton')}
                        </Button>
                      )}
                    </EmptyState.Actions>
                  </EmptyState>
                </Table.Td>
              </Table.Tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <Table.Tr
                  key={row.id}
                  bg={
                    row.getIsSelected()
                      ? 'var(--mantine-color-blue-light)'
                      : undefined
                  }
                >
                  {row.getAllCells().map((cell) => (
                    <Table.Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <UsersBulkActionBar
        users={selectedUsers}
        onClearSelection={() => setRowSelection({})}
        onChanged={onChanged}
      />

      {totalPages > 1 && users.length > 0 && (
        <Group justify="center">
          <Pagination value={page} total={totalPages} onChange={onPageChange} />
        </Group>
      )}
    </Stack>
  )
}
