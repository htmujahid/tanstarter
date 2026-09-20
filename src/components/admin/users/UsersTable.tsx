import { useMemo, useState } from 'react'
import { flexRender, functionalUpdate, useTable } from '@tanstack/react-table'
import type { RowSelectionState, SortingState } from '@tanstack/react-table'
import { Stack, Table } from '@mantine/core'
import UsersBulkActionBar from '#/components/admin/users/UsersBulkActionBar'
import {
  getUsersTableColumns,
  usersTableFeatures,
} from '#/components/admin/users/UsersTableColumn'
import type { AdminUser } from '#/components/admin/users/UsersTableColumn'

export default function UsersTable({
  users,
  currentUserId,
  sortBy,
  sortDirection,
  onSortChange,
  onChanged,
}: {
  users: AdminUser[]
  currentUserId: string
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  onSortChange: (sortBy?: string, sortDirection?: 'asc' | 'desc') => void
  onChanged: () => void
}) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const columns = useMemo(() => getUsersTableColumns(), [])

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
    enableRowSelection: (row) => row.original.id !== currentUserId,
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
        <Table verticalSpacing="sm" highlightOnHover>
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
            {table.getRowModel().rows.map((row) => (
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <UsersBulkActionBar
        users={selectedUsers}
        onClearSelection={() => setRowSelection({})}
        onChanged={onChanged}
      />
    </Stack>
  )
}
