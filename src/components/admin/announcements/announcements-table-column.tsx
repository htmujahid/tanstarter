import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  createColumnHelper,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/react-table'
import { Badge, Checkbox, Text, UnstyledButton } from '@mantine/core'
import {
  IconChevronDown,
  IconChevronUp,
  IconSelector,
} from '@tabler/icons-react'
import type { TFunction } from 'i18next'

import type { Announcement } from '#/server/db'

export const SORTABLE_FIELDS = ['title', 'createdAt', 'updatedAt'] as const
export type SortableField = (typeof SORTABLE_FIELDS)[number]

export const announcementsTableFeatures = tableFeatures({
  rowSortingFeature,
  rowSelectionFeature,
})

const columnHelper = createColumnHelper<
  typeof announcementsTableFeatures,
  Announcement
>()

function FormattedTimestamp({ value }: { value: string }) {
  const [display, setDisplay] = useState<string | null>(null)

  useEffect(() => {
    setDisplay(new Date(value.replace(' ', 'T') + 'Z').toLocaleString())
  }, [value])

  return display ?? '—'
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

export function getAnnouncementsTableColumns(t: TFunction<'admin'>) {
  return columnHelper.columns([
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          aria-label={t('announcements.table.selectAllAria')}
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
          aria-label={t('announcements.table.selectRowAria', {
            title: row.original.title,
          })}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    }),
    columnHelper.accessor('title', {
      header: ({ column }) => (
        <SortableHeader
          label={t('announcements.table.titleColumn')}
          column={column}
        />
      ),
      cell: ({ row }) => (
        <div>
          <Link
            to="/admin/announcements/$announcementId"
            params={{ announcementId: String(row.original.id) }}
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
    columnHelper.accessor('published', {
      header: t('announcements.table.statusColumn'),
      enableSorting: false,
      cell: ({ getValue }) => (
        <Badge color={getValue() ? 'teal' : 'gray'} variant="light" size="sm">
          {getValue()
            ? t('announcements.statusPublished')
            : t('announcements.statusDraft')}
        </Badge>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => (
        <SortableHeader
          label={t('announcements.table.createdColumn')}
          column={column}
        />
      ),
      cell: ({ getValue }) => (
        <Text size="sm" c="dimmed">
          <FormattedTimestamp value={getValue()} />
        </Text>
      ),
    }),
    columnHelper.accessor('updatedAt', {
      header: ({ column }) => (
        <SortableHeader
          label={t('announcements.table.updatedColumn')}
          column={column}
        />
      ),
      cell: ({ getValue }) => (
        <Text size="sm" c="dimmed">
          <FormattedTimestamp value={getValue()} />
        </Text>
      ),
    }),
  ])
}
