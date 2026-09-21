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
import { IconMailbox } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { ContactsBulkActionBar } from '#/components/admin/contacts/contacts-bulk-action-bar'
import {
  getContactsTableColumns,
  contactsTableFeatures,
} from '#/components/admin/contacts/contacts-table-column'
import type { SortableField } from '#/components/admin/contacts/contacts-table-column'
import {
  CONTACT_PAGE_SIZE,
  contactListQueryOptions,
} from '#/lib/queries/contact.query'

export function ContactsTable({
  q,
  sortBy,
  sortDirection,
  page,
  onSortChange,
  onChanged,
  onClearFilters,
  onPageChange,
}: {
  q?: string
  sortBy?: SortableField
  sortDirection?: 'asc' | 'desc'
  page: number
  onSortChange: (sortBy?: string, sortDirection?: 'asc' | 'desc') => void
  onChanged: () => void
  onClearFilters: () => void
  onPageChange: (page: number) => void
}) {
  const { t } = useTranslation('admin')
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const {
    data: { contactSubmissions, total },
  } = useSuspenseQuery(
    contactListQueryOptions({ q, sortBy, sortDirection, page }),
  )
  const totalPages = Math.max(1, Math.ceil(total / CONTACT_PAGE_SIZE))
  const hasFilters = Boolean(q)

  const columns = useMemo(() => getContactsTableColumns(t), [t])

  const sorting: SortingState = sortBy
    ? [{ id: sortBy, desc: sortDirection === 'desc' }]
    : []

  const table = useTable({
    features: contactsTableFeatures,
    data: contactSubmissions,
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
            {contactSubmissions.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length}>
                  <EmptyState
                    icon={<IconMailbox size={28} />}
                    withIndicatorBackground
                    title={
                      hasFilters
                        ? t('contacts.table.emptyTitleFiltered')
                        : t('contacts.table.emptyTitle')
                    }
                    description={
                      hasFilters
                        ? t('contacts.table.emptyDescriptionFiltered')
                        : t('contacts.table.emptyDescription')
                    }
                  >
                    {hasFilters && (
                      <EmptyState.Actions>
                        <Button variant="default" onClick={onClearFilters}>
                          {t('contacts.table.clearFilters')}
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

      <ContactsBulkActionBar
        contacts={selectedRows}
        onClearSelection={() => setRowSelection({})}
        onChanged={onChanged}
      />

      {totalPages > 1 && contactSubmissions.length > 0 && (
        <Group justify="center">
          <Pagination value={page} total={totalPages} onChange={onPageChange} />
        </Group>
      )}
    </Stack>
  )
}
