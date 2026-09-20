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
import type { TFunction } from 'i18next'
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

// `category`/`status` come from a free-text DB column, so they're typed as
// `string` rather than the narrower `FeedbackCategory`/`FeedbackStatus`
// unions — switch on the known values to translate, falling back to the raw
// value for anything unexpected.
export function categoryLabel(t: TFunction<'admin'>, category: string) {
  switch (category) {
    case 'bug':
    case 'feature':
    case 'general':
      return t(`feedback.categories.${category}`)
    default:
      return category
  }
}

function statusLabel(t: TFunction<'admin'>, status: string) {
  switch (status) {
    case 'new':
    case 'reviewed':
    case 'resolved':
      return t(`feedback.statuses.${status}`)
    default:
      return status
  }
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

export function getFeedbackTableColumns(t: TFunction<'admin'>) {
  return columnHelper.columns([
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          aria-label={t('feedback.table.selectAllAria')}
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
          aria-label={t('feedback.table.selectRowAria', {
            name: row.original.submitterName,
          })}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    }),
    columnHelper.display({
      id: 'submitter',
      header: t('feedback.table.submitterColumn'),
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
      header: t('feedback.table.categoryColumn'),
      enableSorting: false,
      cell: ({ getValue }) => (
        <Badge
          color={CATEGORY_COLORS[getValue()] ?? 'gray'}
          variant="light"
          size="sm"
        >
          {categoryLabel(t, getValue())}
        </Badge>
      ),
    }),
    columnHelper.accessor('message', {
      header: t('feedback.table.messageColumn'),
      enableSorting: false,
      cell: ({ getValue }) => (
        <Text size="sm" lineClamp={1} maw={320}>
          {getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('status', {
      header: t('feedback.table.statusColumn'),
      enableSorting: false,
      cell: ({ getValue }) => (
        <Badge
          color={STATUS_COLORS[getValue()] ?? 'gray'}
          variant="light"
          size="sm"
        >
          {statusLabel(t, getValue())}
        </Badge>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => (
        <SortableHeader
          label={t('feedback.table.submittedColumn')}
          column={column}
        />
      ),
      cell: ({ getValue }) => (
        <Text size="sm" c="dimmed">
          {formatTimestamp(getValue())}
        </Text>
      ),
    }),
  ])
}
