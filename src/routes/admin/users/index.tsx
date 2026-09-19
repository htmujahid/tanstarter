import { useState } from 'react'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import {
  Button,
  Group,
  Pagination,
  Select,
  Stack,
  TextInput,
} from '@mantine/core'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import CreateUserForm from '#/components/admin/CreateUserForm'
import UsersTable from '#/components/admin/UsersTable'
import { SORTABLE_FIELDS } from '#/components/admin/UsersTableColumn'
import type { SortableField } from '#/components/admin/UsersTableColumn'
import { listUsersFn } from '#/server/actions/admin'

const PAGE_SIZE = 10

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
  loader: ({ deps }) =>
    listUsersFn({
      data: {
        searchValue: deps.q,
        role: deps.role,
        sortBy: deps.sortBy,
        sortDirection: deps.sortDirection,
        limit: PAGE_SIZE,
        offset: (deps.page - 1) * PAGE_SIZE,
      },
    }),
  staticData: { breadcrumb: 'Users' },
  component: UsersPage,
})

function UsersPage() {
  const { users, total } = Route.useLoaderData()
  const { q, role, sortBy, sortDirection, page } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const router = useRouter()
  const { session } = Route.useRouteContext()
  const [search, setSearch] = useState(q ?? '')
  const [createOpened, setCreateOpened] = useState(false)

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <Stack gap="md">
      <Group justify="space-between" wrap="wrap">
        <Group wrap="wrap">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              void navigate({
                search: {
                  q: search || undefined,
                  role,
                  sortBy,
                  sortDirection,
                  page: 1,
                },
              })
            }}
          >
            <TextInput
              placeholder="Search by name or email"
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
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
        users={users}
        currentUserId={session.user.id}
        sortBy={sortBy}
        sortDirection={sortDirection}
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
        onChanged={() => router.invalidate()}
      />

      {totalPages > 1 && (
        <Group justify="center">
          <Pagination
            value={page}
            total={totalPages}
            onChange={(value) =>
              void navigate({
                search: { q, role, sortBy, sortDirection, page: value },
              })
            }
          />
        </Group>
      )}

      <CreateUserForm
        opened={createOpened}
        onClose={() => setCreateOpened(false)}
        onCreated={() => {
          setCreateOpened(false)
          void router.invalidate()
        }}
      />
    </Stack>
  )
}
