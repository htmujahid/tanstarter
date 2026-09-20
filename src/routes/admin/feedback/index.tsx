import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Group, Select, Stack, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { FeedbackTable } from '#/components/admin/feedback/feedback-table'
import { FeedbackTableSkeleton } from '#/components/admin/feedback/feedback-table-skeleton'
import { feedbackListQueryOptions } from '#/lib/queries/feedback'
import { FEEDBACK_CATEGORIES, FEEDBACK_STATUSES } from '#/server/db/schemas'
import type { FeedbackCategory, FeedbackStatus } from '#/server/db/schemas'

type FeedbackSearch = {
  q?: string
  category?: FeedbackCategory
  status?: FeedbackStatus
  sortBy?: 'createdAt' | 'updatedAt'
  sortDirection?: 'asc' | 'desc'
  page: number
}

export const Route = createFileRoute('/admin/feedback/')({
  validateSearch: (search: Record<string, unknown>): FeedbackSearch => ({
    q: typeof search.q === 'string' && search.q ? search.q : undefined,
    category: FEEDBACK_CATEGORIES.includes(search.category as FeedbackCategory)
      ? (search.category as FeedbackCategory)
      : undefined,
    status: FEEDBACK_STATUSES.includes(search.status as FeedbackStatus)
      ? (search.status as FeedbackStatus)
      : undefined,
    sortBy:
      search.sortBy === 'createdAt' || search.sortBy === 'updatedAt'
        ? search.sortBy
        : undefined,
    sortDirection:
      search.sortDirection === 'asc' || search.sortDirection === 'desc'
        ? search.sortDirection
        : undefined,
    page: typeof search.page === 'number' && search.page > 0 ? search.page : 1,
  }),
  loaderDeps: ({ search }) => ({
    q: search.q,
    category: search.category,
    status: search.status,
    sortBy: search.sortBy,
    sortDirection: search.sortDirection,
    page: search.page,
  }),
  loader: ({ context, deps }) =>
    context.queryClient.query({
      ...feedbackListQueryOptions(deps),
      staleTime: 'static',
    }),
  pendingComponent: () => <FeedbackTableSkeleton />,
  staticData: { breadcrumb: 'Feedback' },
  component: FeedbackPage,
})

function FeedbackPage() {
  const { q, category, status, sortBy, sortDirection, page } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const queryClient = useQueryClient()

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['feedback'] })

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
                  category,
                  status,
                  sortBy,
                  sortDirection,
                  page: 1,
                },
              })
            }}
          >
            <TextInput
              name="q"
              placeholder="Search by message"
              leftSection={<IconSearch size={16} />}
              defaultValue={q ?? ''}
              w={{ base: '100%', sm: 280 }}
            />
          </form>

          <Select
            placeholder="All categories"
            data={FEEDBACK_CATEGORIES.map((value) => ({ value, label: value }))}
            value={category ?? null}
            onChange={(value) =>
              void navigate({
                search: {
                  q,
                  category: FEEDBACK_CATEGORIES.includes(
                    value as FeedbackCategory,
                  )
                    ? (value as FeedbackCategory)
                    : undefined,
                  status,
                  sortBy,
                  sortDirection,
                  page: 1,
                },
              })
            }
            clearable
            w={160}
          />

          <Select
            placeholder="All statuses"
            data={FEEDBACK_STATUSES.map((value) => ({ value, label: value }))}
            value={status ?? null}
            onChange={(value) =>
              void navigate({
                search: {
                  q,
                  category,
                  status: FEEDBACK_STATUSES.includes(value as FeedbackStatus)
                    ? (value as FeedbackStatus)
                    : undefined,
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
      </Group>

      <FeedbackTable
        q={q}
        category={category}
        status={status}
        sortBy={sortBy}
        sortDirection={sortDirection}
        page={page}
        onSortChange={(nextSortBy, nextSortDirection) =>
          void navigate({
            search: {
              q,
              category,
              status,
              sortBy: nextSortBy as typeof sortBy,
              sortDirection: nextSortDirection,
              page: 1,
            },
          })
        }
        onChanged={invalidate}
        onClearFilters={() =>
          void navigate({
            search: {
              q: undefined,
              category: undefined,
              status: undefined,
              sortBy,
              sortDirection,
              page: 1,
            },
          })
        }
        onPageChange={(value) =>
          void navigate({
            search: { q, category, status, sortBy, sortDirection, page: value },
          })
        }
      />
    </Stack>
  )
}
