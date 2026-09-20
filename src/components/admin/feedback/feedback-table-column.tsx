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
import type { listFeedback } from '#/server/services/feedback'

export const SORTABLE_FIELDS = ['createdAt', 'updatedAt'] as const
export type SortableField = (typeof SORTABLE_FIELDS)[number]

export const feedbackTableFeatures = tableFeatures({
  rowSortingFeature,
  rowSelectionFeature,
})

type FeedbackRow = Awaited<ReturnType<typeof listFeedback>>['feedback'][number]

const columnHelper = createColumnHelper<
  typeof feedbackTableFeatures,
  FeedbackRow
>()

function formatTimestamp(value: string) {
  return new Date(value.replace(' ', 'T') + 'Z').toLocaleString()
}

const CATEGORY_COLORS: Record<string, string> = {
  bug: 'red',
  feature: 'blue',
  general: 'gray',
}

const STATUS_COLORS: Record<string, string> = {
  new: 'blue',
  reviewed: 'yellow',
  resolved: 'teal',
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

export function getFeedbackTableColumns() {
  return columnHelper.columns([
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all feedback"
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
          aria-label={`Select feedback from ${row.original.submitterName}`}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    }),
    columnHelper.display({
      id: 'submitter',
      header: 'Submitter',
      cell: ({ row }) => (
        <div>
          <Link
            to="/admin/feedback/$feedbackId"
            params={{ feedbackId: String(row.original.id) }}
            className="text-sm font-medium hover:underline"
          >
            {row.original.submitterName}
          </Link>
          <Text size="xs" c="dimmed">
            {row.original.submitterEmail}
          </Text>
        </div>
      ),
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      enableSorting: false,
      cell: ({ getValue }) => (
        <Badge
          color={CATEGORY_COLORS[getValue()] ?? 'gray'}
          variant="light"
          size="sm"
        >
          {getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor('message', {
      header: 'Message',
      enableSorting: false,
      cell: ({ getValue }) => (
        <Text size="sm" lineClamp={1} maw={320}>
          {getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      enableSorting: false,
      cell: ({ getValue }) => (
        <Badge
          color={STATUS_COLORS[getValue()] ?? 'gray'}
          variant="light"
          size="sm"
        >
          {getValue()}
        </Badge>
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
