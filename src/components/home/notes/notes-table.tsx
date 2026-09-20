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
import { IconNotes, IconPlus } from '@tabler/icons-react'
import { NotesBulkActionBar } from '#/components/home/notes/notes-bulk-action-bar'
import {
  getNotesTableColumns,
  notesTableFeatures,
} from '#/components/home/notes/notes-table-column'
import type { SortableField } from '#/components/home/notes/notes-table-column'
import { NOTES_PAGE_SIZE, notesQueryOptions } from '#/lib/queries/notes'

export function NotesTable({
  q,
  sortBy,
  sortDirection,
  page,
  onSortChange,
  onChanged,
  onAddNote,
  onClearFilters,
  onPageChange,
}: {
  q?: string
  sortBy?: SortableField
  sortDirection?: 'asc' | 'desc'
  page: number
  onSortChange: (sortBy?: string, sortDirection?: 'asc' | 'desc') => void
  onChanged: () => void
  onAddNote: () => void
  onClearFilters: () => void
  onPageChange: (page: number) => void
}) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const {
    data: { notes, total },
  } = useSuspenseQuery(notesQueryOptions({ q, sortBy, sortDirection, page }))
  const totalPages = Math.max(1, Math.ceil(total / NOTES_PAGE_SIZE))
  const hasFilters = Boolean(q)

  const columns = useMemo(() => getNotesTableColumns(), [])

  const sorting: SortingState = sortBy
    ? [{ id: sortBy, desc: sortDirection === 'desc' }]
    : []

  const table = useTable({
    features: notesTableFeatures,
    data: notes,
    columns,
    getRowId: (note) => String(note.id),
    manualSorting: true,
    enableMultiSort: false,
    enableRowSelection: true,
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

  const selectedNotes = table.getSelectedRowModel().rows.map((r) => r.original)

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
            {notes.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length}>
                  <EmptyState
                    icon={<IconNotes size={28} />}
                    withIndicatorBackground
                    title={hasFilters ? 'No notes found' : 'No notes yet'}
                    description={
                      hasFilters
                        ? 'Try adjusting your search to find what you are looking for.'
                        : 'Get started by adding your first note.'
                    }
                  >
                    <EmptyState.Actions>
                      {hasFilters ? (
                        <Button variant="default" onClick={onClearFilters}>
                          Clear filters
                        </Button>
                      ) : (
                        <Button
                          leftSection={<IconPlus size={16} />}
                          onClick={onAddNote}
                        >
                          Add note
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

      <NotesBulkActionBar
        notes={selectedNotes}
        onClearSelection={() => setRowSelection({})}
        onChanged={onChanged}
      />

      {totalPages > 1 && notes.length > 0 && (
        <Group justify="center">
          <Pagination value={page} total={totalPages} onChange={onPageChange} />
        </Group>
      )}
    </Stack>
  )
}
