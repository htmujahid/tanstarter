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
import type { Note } from '#/server/db'

export const SORTABLE_FIELDS = ['title', 'createdAt', 'updatedAt'] as const
export type SortableField = (typeof SORTABLE_FIELDS)[number]

export const notesTableFeatures = tableFeatures({
  rowSortingFeature,
  rowSelectionFeature,
})

const columnHelper = createColumnHelper<typeof notesTableFeatures, Note>()

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

export function getNotesTableColumns() {
  return columnHelper.columns([
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all notes"
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
          aria-label={`Select ${row.original.title}`}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    }),
    columnHelper.accessor('title', {
      header: ({ column }) => <SortableHeader label="Title" column={column} />,
      cell: ({ row }) => (
        <div>
          <Link
            to="/home/notes/$noteId"
            params={{ noteId: String(row.original.id) }}
            className="text-sm font-medium hover:underline"
          >
            {row.original.title}
          </Link>
          {row.original.body && (
            <Text size="xs" c="dimmed" lineClamp={1}>
              {row.original.body}
            </Text>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => (
        <SortableHeader label="Created" column={column} />
      ),
      cell: ({ getValue }) => (
        <Text size="sm" c="dimmed">
          {formatTimestamp(getValue())}
        </Text>
      ),
    }),
    columnHelper.accessor('updatedAt', {
      header: ({ column }) => (
        <SortableHeader label="Updated" column={column} />
      ),
      cell: ({ getValue }) => (
        <Text size="sm" c="dimmed">
          {formatTimestamp(getValue())}
        </Text>
      ),
    }),
  ])
}
