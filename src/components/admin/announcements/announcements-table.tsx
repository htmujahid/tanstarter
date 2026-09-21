import { useMemo, useState } from 'react'
import { flexRender, functionalUpdate, useTable } from '@tanstack/react-table'
import type { RowSelectionState, SortingState } from '@tanstack/react-table'
import { eq, ilike, useLiveQuery } from '@tanstack/react-db'
import {
  Button,
  EmptyState,
  Group,
  Pagination,
  Stack,
  Table,
} from '@mantine/core'
import { IconPlus, IconSpeakerphone } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { AnnouncementsBulkActionBar } from '#/components/admin/announcements/announcements-bulk-action-bar'
import {
  getAnnouncementsTableColumns,
  announcementsTableFeatures,
} from '#/components/admin/announcements/announcements-table-column'
import type { SortableField } from '#/components/admin/announcements/announcements-table-column'
import { ANNOUNCEMENTS_PAGE_SIZE } from '#/lib/queries/announcements'
import { announcementsCollection } from '#/lib/collections/announcements'

export function AnnouncementsTable({
  q,
  published,
  sortBy,
  sortDirection,
  page,
  onSortChange,
  onAddAnnouncement,
  onClearFilters,
  onPageChange,
}: {
  q?: string
  published?: boolean
  sortBy?: SortableField
  sortDirection?: 'asc' | 'desc'
  page: number
  onSortChange: (sortBy?: string, sortDirection?: 'asc' | 'desc') => void
  onAddAnnouncement: () => void
  onClearFilters: () => void
  onPageChange: (page: number) => void
}) {
  const { t } = useTranslation('admin')
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { data } = useLiveQuery({
    query: (query) => {
      let liveQuery = query.from({ announcement: announcementsCollection })

      if (published !== undefined) {
        liveQuery = liveQuery.where(({ announcement }) =>
          eq(announcement.published, published),
        )
      }
      if (q) {
        liveQuery = liveQuery.where(({ announcement }) =>
          ilike(announcement.title, `%${q}%`),
        )
      }

      return liveQuery.orderBy(({ announcement }) => {
        switch (sortBy) {
          case 'title':
            return announcement.title
          case 'updatedAt':
            return announcement.updatedAt
          default:
            return announcement.createdAt
        }
      }, sortDirection ?? 'desc')
    },
  })

  const total = data.length
  const totalPages = Math.max(1, Math.ceil(total / ANNOUNCEMENTS_PAGE_SIZE))
  const announcements = data.slice(
    (page - 1) * ANNOUNCEMENTS_PAGE_SIZE,
    page * ANNOUNCEMENTS_PAGE_SIZE,
  )
  const hasFilters = Boolean(q || published !== undefined)

  const columns = useMemo(() => getAnnouncementsTableColumns(t), [t])

  const sorting: SortingState = sortBy
    ? [{ id: sortBy, desc: sortDirection === 'desc' }]
    : []

  const table = useTable({
    features: announcementsTableFeatures,
    data: announcements,
    columns,
    getRowId: (announcement) => String(announcement.id),
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

  const selectedAnnouncements = table
    .getSelectedRowModel()
    .rows.map((r) => r.original)

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
            {announcements.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length}>
                  <EmptyState
                    icon={<IconSpeakerphone size={28} />}
                    withIndicatorBackground
                    title={
                      hasFilters
                        ? t('announcements.table.emptyTitleFiltered')
                        : t('announcements.table.emptyTitle')
                    }
                    description={
                      hasFilters
                        ? t('announcements.table.emptyDescriptionFiltered')
                        : t('announcements.table.emptyDescription')
                    }
                  >
                    <EmptyState.Actions>
                      {hasFilters ? (
                        <Button variant="default" onClick={onClearFilters}>
                          {t('announcements.table.clearFilters')}
                        </Button>
                      ) : (
                        <Button
                          leftSection={<IconPlus size={16} />}
                          onClick={onAddAnnouncement}
                        >
                          {t('announcements.addAnnouncement')}
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

      <AnnouncementsBulkActionBar
        announcements={selectedAnnouncements}
        onClearSelection={() => setRowSelection({})}
      />

      {totalPages > 1 && announcements.length > 0 && (
        <Group justify="center">
          <Pagination value={page} total={totalPages} onChange={onPageChange} />
        </Group>
      )}
    </Stack>
  )
}
