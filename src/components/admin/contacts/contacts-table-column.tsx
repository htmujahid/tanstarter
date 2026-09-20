import {
  createColumnHelper,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/react-table'
import { Link } from '@tanstack/react-router'
import { Checkbox, Text, UnstyledButton } from '@mantine/core'
import {
  IconChevronDown,
  IconChevronUp,
  IconSelector,
} from '@tabler/icons-react'
import type { ContactSubmission } from '#/server/db/schemas'

export const SORTABLE_FIELDS = ['name', 'createdAt'] as const
export type SortableField = (typeof SORTABLE_FIELDS)[number]

export const contactsTableFeatures = tableFeatures({
  rowSortingFeature,
  rowSelectionFeature,
})

const columnHelper = createColumnHelper<
  typeof contactsTableFeatures,
  ContactSubmission
>()

function formatTimestamp(value: string) {
  return new Date(value.replace(' ', 'T') + 'Z').toLocaleString()
}

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

export function getContactsTableColumns() {
  return columnHelper.columns([
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all contact submissions"
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
          aria-label={`Select submission from ${row.original.name}`}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    }),
    columnHelper.accessor('name', {
      header: ({ column }) => <SortableHeader label="Name" column={column} />,
      cell: ({ row }) => (
        <div>
          <Link
            to="/admin/contacts/$contactId"
            params={{ contactId: String(row.original.id) }}
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
    columnHelper.accessor('message', {
      header: 'Message',
      enableSorting: false,
      cell: ({ getValue }) => (
        <Text size="sm" lineClamp={1} maw={360}>
          {getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => (
        <SortableHeader label="Submitted" column={column} />
      ),
      cell: ({ getValue }) => (
        <Text size="sm" c="dimmed">
          {formatTimestamp(getValue())}
        </Text>
      ),
    }),
  ])
}
