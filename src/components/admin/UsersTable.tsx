import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { flexRender, functionalUpdate, useTable } from '@tanstack/react-table'
import type { SortingState } from '@tanstack/react-table'
import {
  Alert,
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  Table,
  Text,
  Textarea,
} from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { authClient } from '#/lib/auth-client'
import {
  getUsersTableColumns,
  usersTableFeatures,
} from '#/components/admin/UsersTableColumn'
import type { AdminUser } from '#/components/admin/UsersTableColumn'

export default function UsersTable({
  users,
  currentUserId,
  sortBy,
  sortDirection,
  onSortChange,
  onChanged,
}: {
  users: AdminUser[]
  currentUserId: string
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  onSortChange: (sortBy?: string, sortDirection?: 'asc' | 'desc') => void
  onChanged: () => void
}) {
  const navigate = useNavigate()
  const [actionError, setActionError] = useState<string | null>(null)
  const [banUser, setBanUser] = useState<AdminUser | null>(null)
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)

  async function run(id: string, action: () => Promise<{ error: unknown }>) {
    setActionError(null)
    setPendingId(id)
    const { error } = await action()
    setPendingId(null)

    if (error) {
      setActionError(
        (error as { message?: string }).message ?? 'Something went wrong',
      )
      return false
    }

    return true
  }

  async function handleUnban(user: AdminUser) {
    const ok = await run(user.id, () =>
      authClient.admin.unbanUser({ userId: user.id }),
    )
    if (ok) onChanged()
  }

  async function handleImpersonate(user: AdminUser) {
    const ok = await run(user.id, () =>
      authClient.admin.impersonateUser({ userId: user.id }),
    )
    if (ok) await navigate({ to: '/home' })
  }

  async function handleDelete() {
    if (!deleteUser) return
    const ok = await run(deleteUser.id, () =>
      authClient.admin.removeUser({ userId: deleteUser.id }),
    )
    if (ok) {
      setDeleteUser(null)
      onChanged()
    }
  }

  const columns = useMemo(
    () =>
      getUsersTableColumns({
        currentUserId,
        pendingId,
        onView: (user) =>
          navigate({
            to: '/admin/users/$userId',
            params: { userId: user.id },
          }),
        onImpersonate: handleImpersonate,
        onBan: setBanUser,
        onUnban: handleUnban,
        onDelete: setDeleteUser,
      }),
    [currentUserId, pendingId],
  )

  const sorting: SortingState = sortBy
    ? [{ id: sortBy, desc: sortDirection === 'desc' }]
    : []

  const table = useTable({
    features: usersTableFeatures,
    data: users,
    columns,
    getRowId: (user) => user.id,
    manualSorting: true,
    enableMultiSort: false,
    state: { sorting },
    onSortingChange: (updater) => {
      const next = functionalUpdate(updater, sorting)
      const nextSort = next.at(0)
      onSortChange(
        nextSort?.id,
        nextSort ? (nextSort.desc ? 'desc' : 'asc') : undefined,
      )
    },
  })

  return (
    <Stack gap="md">
      {actionError && (
        <Alert
          color="red"
          icon={<IconAlertCircle size={16} />}
          withCloseButton
          onClose={() => setActionError(null)}
        >
          {actionError}
        </Alert>
      )}

      <Table.ScrollContainer minWidth={640}>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.Th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}
          </Table.Thead>
          <Table.Tbody>
            {table.getRowModel().rows.map((row) => (
              <Table.Tr key={row.id}>
                {row.getAllCells().map((cell) => (
                  <Table.Td
                    key={cell.id}
                    ta={cell.column.id === 'actions' ? 'right' : undefined}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <BanUserModal
        user={banUser}
        onClose={() => setBanUser(null)}
        onChanged={() => {
          setBanUser(null)
          onChanged()
        }}
      />

      <Modal
        opened={Boolean(deleteUser)}
        onClose={() => setDeleteUser(null)}
        title="Delete user"
      >
        <Stack gap="md">
          <Text size="sm">
            Permanently delete <strong>{deleteUser?.name}</strong>? This cannot
            be undone.
          </Text>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setDeleteUser(null)}>
              Cancel
            </Button>
            <Button
              color="red"
              loading={pendingId === deleteUser?.id}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
}

function BanUserModal({
  user,
  onClose,
  onChanged,
}: {
  user: AdminUser | null
  onClose: () => void
  onChanged: () => void
}) {
  const [reason, setReason] = useState('')
  const [days, setDays] = useState<number | string>('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setReason('')
      setDays('')
      setError(null)
    }
  }, [user])

  return (
    <Modal
      opened={Boolean(user)}
      onClose={onClose}
      title={`Ban ${user?.name ?? ''}`}
    >
      <Stack gap="md">
        {error && (
          <Alert color="red" icon={<IconAlertCircle size={16} />}>
            {error}
          </Alert>
        )}

        <Textarea
          label="Reason"
          placeholder="Optional"
          value={reason}
          onChange={(event) => setReason(event.currentTarget.value)}
        />

        <NumberInput
          label="Ban duration (days)"
          description="Leave blank to ban permanently"
          placeholder="Permanent"
          min={1}
          value={days}
          onChange={setDays}
        />

        <Group justify="flex-end">
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="red"
            loading={submitting}
            onClick={async () => {
              if (!user) return
              setSubmitting(true)
              const { error: err } = await authClient.admin.banUser({
                userId: user.id,
                banReason: reason || undefined,
                banExpiresIn:
                  typeof days === 'number' ? days * 86400 : undefined,
              })
              setSubmitting(false)

              if (err) {
                setError(err.message ?? 'Unable to ban user')
                return
              }

              onChanged()
            }}
          >
            Ban user
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
