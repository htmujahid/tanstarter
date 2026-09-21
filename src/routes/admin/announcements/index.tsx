import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, Group, Select, Stack, TextInput } from '@mantine/core'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { AnnouncementsTable } from '#/components/admin/announcements/announcements-table'
import { AnnouncementsTableSkeleton } from '#/components/admin/announcements/announcements-table-skeleton'
import { CreateAnnouncementForm } from '#/components/admin/announcements/create-announcement-form'
import { SORTABLE_FIELDS } from '#/components/admin/announcements/announcements-table-column'
import type { SortableField } from '#/components/admin/announcements/announcements-table-column'
import { announcementsCollectionOptions } from '#/lib/collections/announcements.collection'

type AnnouncementsSearch = {
  q?: string
  published?: 'true' | 'false'
  sortBy?: SortableField
  sortDirection?: 'asc' | 'desc'
  page: number
}

export const Route = createFileRoute('/admin/announcements/')({
  validateSearch: (search: Record<string, unknown>): AnnouncementsSearch => ({
    q: typeof search.q === 'string' && search.q ? search.q : undefined,
    published:
      search.published === 'true' || search.published === 'false'
        ? search.published
        : undefined,
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
    context.dbClient.collection(announcementsCollectionOptions).preload(),
  pendingComponent: () => <AnnouncementsTableSkeleton />,
  staticData: { breadcrumb: 'Announcements' },
  component: AnnouncementsPage,
})

function AnnouncementsPage() {
  const { t } = useTranslation('admin')
  const { q, published, sortBy, sortDirection, page } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const [createOpened, setCreateOpened] = useState(false)

  return (
    <Stack gap="md">
      <Group justify="space-between" wrap="wrap">
        <Group wrap="wrap">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const value = new FormData(event.currentTarget)
                .get('q')
                ?.toString()
              void navigate({
                search: {
                  q: value || undefined,
                  published,
                  sortBy,
                  sortDirection,
                  page: 1,
                },
              })
            }}
          >
            <TextInput
              name="q"
              placeholder={t('announcements.searchPlaceholder')}
              leftSection={<IconSearch size={16} />}
              defaultValue={q ?? ''}
              w={{ base: '100%', sm: 320 }}
            />
          </form>

          <Select
            placeholder={t('announcements.statusFilterPlaceholder')}
            data={[
              { value: 'true', label: t('announcements.statusPublished') },
              { value: 'false', label: t('announcements.statusDraft') },
            ]}
            value={published ?? null}
            onChange={(value) =>
              void navigate({
                search: {
                  q,
                  published:
                    value === 'true' || value === 'false' ? value : undefined,
                  sortBy,
                  sortDirection,
                  page: 1,
                },
              })
            }
            clearable
            w={160}
          />
        </Group>

        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setCreateOpened(true)}
        >
          {t('announcements.addAnnouncement')}
        </Button>
      </Group>

      <AnnouncementsTable
        q={q}
        published={published === undefined ? undefined : published === 'true'}
        sortBy={sortBy}
        sortDirection={sortDirection}
        page={page}
        onSortChange={(nextSortBy, nextSortDirection) =>
          void navigate({
            search: {
              q,
              published,
              sortBy: nextSortBy as typeof sortBy,
              sortDirection: nextSortDirection,
              page: 1,
            },
          })
        }
        onAddAnnouncement={() => setCreateOpened(true)}
        onClearFilters={() =>
          void navigate({
            search: {
              q: undefined,
              published: undefined,
              sortBy,
              sortDirection,
              page: 1,
            },
          })
        }
        onPageChange={(value) =>
          void navigate({
            search: { q, published, sortBy, sortDirection, page: value },
          })
        }
      />

      <CreateAnnouncementForm
        opened={createOpened}
        onClose={() => setCreateOpened(false)}
        onCreated={() => setCreateOpened(false)}
      />
    </Stack>
  )
}
