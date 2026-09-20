import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Group, Select, Stack, TextInput } from '@mantine/core'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { CreateUserForm } from '#/components/admin/users/create-user-form'
import { UsersTable } from '#/components/admin/users/users-table'
import { UsersTableSkeleton } from '#/components/admin/users/users-table-skeleton'
import { SORTABLE_FIELDS } from '#/components/admin/users/users-table-column'
import type { SortableField } from '#/components/admin/users/users-table-column'
import { usersQueryOptions } from '#/lib/queries/admin'

type UsersSearch = {
  q?: string
  role?: 'admin' | 'user'
  sortBy?: SortableField
  sortDirection?: 'asc' | 'desc'
  page: number
}

export const Route = createFileRoute('/admin/users/')({
  validateSearch: (search: Record<string, unknown>): UsersSearch => ({
    q: typeof search.q === 'string' && search.q ? search.q : undefined,
    role:
      search.role === 'admin' || search.role === 'user'
        ? search.role
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
  loaderDeps: ({ search }) => ({
    q: search.q,
    role: search.role,
    sortBy: search.sortBy,
    sortDirection: search.sortDirection,
    page: search.page,
  }),
  loader: ({ context, deps }) =>
    context.queryClient.query({
      ...usersQueryOptions(deps),
      staleTime: 'static',
    }),
  pendingComponent: () => <UsersTableSkeleton />,
  staticData: { breadcrumb: 'Users' },
  component: UsersPage,
})

function UsersPage() {
  const { q, role, sortBy, sortDirection, page } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const queryClient = useQueryClient()
  const [createOpened, setCreateOpened] = useState(false)

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['admin'] })

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
                  role,
                  sortBy,
                  sortDirection,
                  page: 1,
                },
              })
            }}
          >
            <TextInput
              name="q"
              placeholder="Search by name or email"
              leftSection={<IconSearch size={16} />}
              defaultValue={q ?? ''}
              w={{ base: '100%', sm: 320 }}
            />
          </form>

          <Select
            placeholder="All roles"
            data={[
              { value: 'admin', label: 'Admin' },
              { value: 'user', label: 'User' },
            ]}
            value={role ?? null}
            onChange={(value) =>
              void navigate({
                search: {
                  q,
                  role:
                    value === 'admin' || value === 'user' ? value : undefined,
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
          Add user
        </Button>
      </Group>

      <UsersTable
        q={q}
        role={role}
        sortBy={sortBy}
        sortDirection={sortDirection}
        page={page}
        onSortChange={(nextSortBy, nextSortDirection) =>
          void navigate({
            search: {
              q,
              role,
              sortBy: nextSortBy as typeof sortBy,
              sortDirection: nextSortDirection,
              page: 1,
            },
          })
        }
        onChanged={invalidate}
        onAddUser={() => setCreateOpened(true)}
        onClearFilters={() =>
          void navigate({
            search: {
              q: undefined,
              role: undefined,
              sortBy,
              sortDirection,
              page: 1,
            },
          })
        }
        onPageChange={(value) =>
          void navigate({
            search: { q, role, sortBy, sortDirection, page: value },
          })
        }
      />

      <CreateUserForm
        opened={createOpened}
        onClose={() => setCreateOpened(false)}
        onCreated={() => {
          setCreateOpened(false)
          void invalidate()
        }}
      />
    </Stack>
  )
}
