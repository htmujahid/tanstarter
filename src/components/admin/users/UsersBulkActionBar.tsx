import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  ActionBar,
  Alert,
  Button,
  Group,
  Modal,
  Stack,
  Text,
} from '@mantine/core'
import {
  IconAlertCircle,
  IconBan,
  IconTrash,
  IconUserCheck,
  IconUserShield,
} from '@tabler/icons-react'
import { authClient } from '#/lib/auth-client'
import BanUserModal from '#/components/admin/users/BanUserModal'
import type { AdminUser } from '#/components/admin/users/UsersTableColumn'

export default function UsersBulkActionBar({
  users,
  onClearSelection,
  onChanged,
}: {
  users: AdminUser[]
  onClearSelection: () => void
  onChanged: () => void
}) {
  const navigate = useNavigate()
  const [actionError, setActionError] = useState<string | null>(null)
  const [banUsers, setBanUsers] = useState<AdminUser[]>([])
  const [deleteUsers, setDeleteUsers] = useState<AdminUser[]>([])
  const [pending, setPending] = useState<'impersonate' | 'unban' | null>(null)

  const hasActiveSelected = users.some((user) => !user.banned)
  const hasBannedSelected = users.some((user) => user.banned)

  async function run(action: () => Promise<{ error: unknown }>) {
    setActionError(null)
    const { error } = await action()

    if (error) {
      setActionError(
        (error as { message?: string }).message ?? 'Something went wrong',
      )
      return false
    }

    return true
  }

  async function handleImpersonate() {
    const target = users[0]

    setPending('impersonate')
    const ok = await run(() =>
      authClient.admin.impersonateUser({ userId: target.id }),
    )
    setPending(null)
    if (ok) await navigate({ to: '/home' })
  }

  async function handleBulkUnban() {
    const targets = users.filter((user) => user.banned)
    if (targets.length === 0) return

    setPending('unban')
    const results = await Promise.all(
      targets.map((user) =>
        run(() => authClient.admin.unbanUser({ userId: user.id })),
      ),
    )
    setPending(null)

    if (results.every(Boolean)) {
      onClearSelection()
      onChanged()
    }
  }

  async function handleBulkDelete() {
    const results = await Promise.all(
      deleteUsers.map((user) =>
        run(() => authClient.admin.removeUser({ userId: user.id })),
      ),
    )

    if (results.every(Boolean)) {
      setDeleteUsers([])
      onClearSelection()
      onChanged()
    }
  }

  return (
    <>
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

      <ActionBar opened={users.length > 0} onClose={onClearSelection}>
        <Text size="sm" fw={500} visibleFrom="xs">
          {users.length} selected
        </Text>
        <ActionBar.Divider visibleFrom="xs" />

        {users.length === 1 && (
          <Button
            variant="default"
            size="compact-sm"
            leftSection={<IconUserShield size={14} />}
            loading={pending === 'impersonate'}
            onClick={handleImpersonate}
          >
            Impersonate
          </Button>
        )}

        {hasActiveSelected && (
          <Button
            variant="default"
            size="compact-sm"
            leftSection={<IconBan size={14} />}
            onClick={() => setBanUsers(users.filter((user) => !user.banned))}
          >
            Ban
          </Button>
        )}

        {hasBannedSelected && (
          <Button
            variant="default"
            size="compact-sm"
            leftSection={<IconUserCheck size={14} />}
            loading={pending === 'unban'}
            onClick={handleBulkUnban}
          >
            Unban
          </Button>
        )}

        <Button
          variant="default"
          color="red"
          size="compact-sm"
          leftSection={<IconTrash size={14} />}
          onClick={() => setDeleteUsers(users)}
        >
          Delete
        </Button>

        <ActionBar.CloseButton />
      </ActionBar>

      <BanUserModal
        users={banUsers}
        onClose={() => setBanUsers([])}
        onChanged={() => {
          setBanUsers([])
          onClearSelection()
          onChanged()
        }}
      />

      <Modal
        opened={deleteUsers.length > 0}
        onClose={() => setDeleteUsers([])}
        title={
          deleteUsers.length === 1
            ? `Delete user`
            : `Delete ${deleteUsers.length} users`
        }
      >
        <Stack gap="md">
          <Text size="sm">
            Permanently delete{' '}
            {deleteUsers.length === 1 ? (
              <strong>{deleteUsers[0].name}</strong>
            ) : (
              `${deleteUsers.length} users`
            )}
            ? This cannot be undone.
          </Text>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setDeleteUsers([])}>
              Cancel
            </Button>
            <Button color="red" onClick={handleBulkDelete}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}
