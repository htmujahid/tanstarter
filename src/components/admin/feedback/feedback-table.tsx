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
import { IconMessageCircle } from '@tabler/icons-react'
import { FeedbackBulkActionBar } from '#/components/admin/feedback/feedback-bulk-action-bar'
import {
  getFeedbackTableColumns,
  feedbackTableFeatures,
} from '#/components/admin/feedback/feedback-table-column'
import type { SortableField } from '#/components/admin/feedback/feedback-table-column'
import {
  FEEDBACK_PAGE_SIZE,
  feedbackListQueryOptions,
} from '#/lib/queries/feedback'
import type { FeedbackCategory, FeedbackStatus } from '#/server/db/schemas'

export function FeedbackTable({
  q,
  category,
  status,
  sortBy,
  sortDirection,
  page,
  onSortChange,
  onChanged,
  onClearFilters,
  onPageChange,
}: {
  q?: string
  category?: FeedbackCategory
  status?: FeedbackStatus
  sortBy?: SortableField
  sortDirection?: 'asc' | 'desc'
  page: number
  onSortChange: (sortBy?: string, sortDirection?: 'asc' | 'desc') => void
  onChanged: () => void
  onClearFilters: () => void
  onPageChange: (page: number) => void
}) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const {
    data: { feedback, total },
  } = useSuspenseQuery(
    feedbackListQueryOptions({
      q,
      category,
      status,
      sortBy,
      sortDirection,
      page,
    }),
  )
  const totalPages = Math.max(1, Math.ceil(total / FEEDBACK_PAGE_SIZE))
  const hasFilters = Boolean(q || category || status)

  const columns = useMemo(() => getFeedbackTableColumns(), [])

  const sorting: SortingState = sortBy
    ? [{ id: sortBy, desc: sortDirection === 'desc' }]
    : []

  const table = useTable({
    features: feedbackTableFeatures,
    data: feedback,
    columns,
    getRowId: (row) => String(row.id),
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

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original)

  return (
    <Stack gap="md">
      <Table.ScrollContainer minWidth={720}>
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
            {feedback.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length}>
                  <EmptyState
                    icon={<IconMessageCircle size={28} />}
                    withIndicatorBackground
                    title={hasFilters ? 'No feedback found' : 'No feedback yet'}
                    description={
                      hasFilters
                        ? 'Try adjusting your search or filters to find what you are looking for.'
                        : 'Feedback submitted by users will show up here.'
                    }
                  >
                    {hasFilters && (
                      <EmptyState.Actions>
                        <Button variant="default" onClick={onClearFilters}>
                          Clear filters
                        </Button>
                      </EmptyState.Actions>
                    )}
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

      <FeedbackBulkActionBar
        feedback={selectedRows}
        onClearSelection={() => setRowSelection({})}
        onChanged={onChanged}
      />

      {totalPages > 1 && feedback.length > 0 && (
        <Group justify="center">
          <Pagination value={page} total={totalPages} onChange={onPageChange} />
        </Group>
      )}
    </Stack>
  )
}
