import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, Group, Stack, TextInput } from '@mantine/core'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { CreateNoteForm } from '#/components/home/notes/create-note-form'
import { NotesTable } from '#/components/home/notes/notes-table'
import { NotesTableSkeleton } from '#/components/home/notes/notes-table-skeleton'
import { SORTABLE_FIELDS } from '#/components/home/notes/notes-table-column'
import type { SortableField } from '#/components/home/notes/notes-table-column'
import { notesCollectionOptions } from '#/lib/collections/notes'

type NotesSearch = {
  q?: string
  sortBy?: SortableField
  sortDirection?: 'asc' | 'desc'
  page: number
}

export const Route = createFileRoute('/home/notes/')({
  validateSearch: (search: Record<string, unknown>): NotesSearch => ({
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
  loader: ({ context }) =>
    context.dbClient.collection(notesCollectionOptions).preload(),
  pendingComponent: () => <NotesTableSkeleton />,
  staticData: { breadcrumb: 'Notes' },
  component: NotesPage,
})

function NotesPage() {
  const { t } = useTranslation('home')
  const { q, sortBy, sortDirection, page } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const [createOpened, setCreateOpened] = useState(false)

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
            placeholder={t('notes.searchPlaceholder')}
            leftSection={<IconSearch size={16} />}
            defaultValue={q ?? ''}
            w={{ base: '100%', sm: 320 }}
          />
        </form>

        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setCreateOpened(true)}
        >
          {t('notes.addButton')}
        </Button>
      </Group>

      <NotesTable
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
        onAddNote={() => setCreateOpened(true)}
        onClearFilters={() =>
          void navigate({
            search: { q: undefined, sortBy, sortDirection, page: 1 },
          })
        }
        onPageChange={(value) =>
          void navigate({ search: { q, sortBy, sortDirection, page: value } })
        }
      />

      <CreateNoteForm
        opened={createOpened}
        onClose={() => setCreateOpened(false)}
        onCreated={() => setCreateOpened(false)}
      />
    </Stack>
  )
}
