import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Group, Stack, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ContactsTable } from '#/components/admin/contacts/contacts-table'
import { ContactsTableSkeleton } from '#/components/admin/contacts/contacts-table-skeleton'
import { SORTABLE_FIELDS } from '#/components/admin/contacts/contacts-table-column'
import type { SortableField } from '#/components/admin/contacts/contacts-table-column'
import { contactListQueryOptions } from '#/lib/queries/contact.query'

type ContactSearch = {
  q?: string
  sortBy?: SortableField
  sortDirection?: 'asc' | 'desc'
  page: number
}

export const Route = createFileRoute('/admin/contacts/')({
  validateSearch: (search: Record<string, unknown>): ContactSearch => ({
    q: typeof search.q === 'string' && search.q ? search.q : undefined,
    sortBy: SORTABLE_FIELDS.includes(search.sortBy as SortableField)
      ? (search.sortBy as SortableField)
      : undefined,
    sortDirection:
      search.sortDirection === 'asc' || search.sortDirection === 'desc'
        ? search.sortDirection
        : undefined,
    page: typeof search.page === 'number' && search.page > 0 ? search.page : 1,
  }),
  loaderDeps: ({ search }) => ({
    q: search.q,
    sortBy: search.sortBy,
    sortDirection: search.sortDirection,
    page: search.page,
  }),
  loader: ({ context, deps }) =>
    context.queryClient.query({
      ...contactListQueryOptions(deps),
      staleTime: 'static',
    }),
  pendingComponent: () => <ContactsTableSkeleton />,
  staticData: { breadcrumb: 'Contact submissions' },
  component: ContactsPage,
})

function ContactsPage() {
  const { t } = useTranslation('admin')
  const { q, sortBy, sortDirection, page } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const queryClient = useQueryClient()

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['contact'] })

  return (
    <Stack gap="md">
      <Group justify="space-between" wrap="wrap">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const value = new FormData(event.currentTarget).get('q')?.toString()
            void navigate({
              search: { q: value || undefined, sortBy, sortDirection, page: 1 },
            })
          }}
        >
          <TextInput
            name="q"
            placeholder={t('contacts.searchPlaceholder')}
            leftSection={<IconSearch size={16} />}
            defaultValue={q ?? ''}
            w={{ base: '100%', sm: 320 }}
          />
        </form>
      </Group>

      <ContactsTable
        q={q}
        sortBy={sortBy}
        sortDirection={sortDirection}
        page={page}
        onSortChange={(nextSortBy, nextSortDirection) =>
          void navigate({
            search: {
              q,
              sortBy: nextSortBy as typeof sortBy,
              sortDirection: nextSortDirection,
              page: 1,
            },
          })
        }
        onChanged={invalidate}
        onClearFilters={() =>
          void navigate({
            search: { q: undefined, sortBy, sortDirection, page: 1 },
          })
        }
        onPageChange={(value) =>
          void navigate({ search: { q, sortBy, sortDirection, page: value } })
        }
      />
    </Stack>
  )
}
