import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Alert, Button, Group, Modal, Stack, Text } from '@mantine/core'
import {
  IconAlertCircle,
  IconBan,
  IconTrash,
  IconUserCheck,
  IconUserShield,
} from '@tabler/icons-react'
import { authClient } from '#/lib/auth-client'
import BanUserModal from '#/components/admin/BanUserModal'
import type { AdminUser } from '#/components/admin/UsersTableColumn'

export default function UserActionsBar({
  user,
  isSelf,
  onChanged,
}: {
  user: AdminUser
  isSelf: boolean
  onChanged: () => void
}) {
  const navigate = useNavigate()
  const [actionError, setActionError] = useState<string | null>(null)
  const [pending, setPending] = useState<
    'impersonate' | 'unban' | 'delete' | null
  >(null)
  const [banModalOpen, setBanModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const isBanned = Boolean(user.banned)

  async function run(
    action: 'impersonate' | 'unban' | 'delete',
    fn: () => Promise<{ error: unknown }>,
  ) {
    setActionError(null)
    setPending(action)
    const { error } = await fn()
    setPending(null)

    if (error) {
      setActionError(
        (error as { message?: string }).message ?? 'Something went wrong',
      )
      return false
    }

    return true
  }

  async function handleImpersonate() {
    const ok = await run('impersonate', () =>
      authClient.admin.impersonateUser({ userId: user.id }),
    )
    if (ok) await navigate({ to: '/home' })
  }

  async function handleUnban() {
    const ok = await run('unban', () =>
      authClient.admin.unbanUser({ userId: user.id }),
    )
    if (ok) onChanged()
  }

  async function handleDelete() {
    const ok = await run('delete', () =>
      authClient.admin.removeUser({ userId: user.id }),
    )
    if (ok) await navigate({ to: '/admin/users', search: { page: 1 } })
  }

  if (isSelf) return null

  return (
    <Stack gap="xs" align="flex-end">
      <Group gap="xs" wrap="wrap" justify="flex-end">
        <Button
          variant="light"
          leftSection={<IconUserShield size={16} />}
          loading={pending === 'impersonate'}
          onClick={handleImpersonate}
        >
          Impersonate
        </Button>

        {isBanned ? (
          <Button
            variant="light"
            color="teal"
            leftSection={<IconUserCheck size={16} />}
            loading={pending === 'unban'}
            onClick={handleUnban}
          >
            Unban
          </Button>
        ) : (
          <Button
            variant="light"
            color="red"
            leftSection={<IconBan size={16} />}
            onClick={() => setBanModalOpen(true)}
          >
            Ban
          </Button>
        )}

        <Button
          variant="light"
          color="red"
          leftSection={<IconTrash size={16} />}
          onClick={() => setDeleteModalOpen(true)}
        >
          Delete
        </Button>
      </Group>

      {actionError && (
        <Alert
          color="red"
          icon={<IconAlertCircle size={16} />}
          withCloseButton
          onClose={() => setActionError(null)}
          className="w-full"
        >
          {actionError}
        </Alert>
      )}

      <BanUserModal
        user={banModalOpen ? user : null}
        onClose={() => setBanModalOpen(false)}
        onChanged={() => {
          setBanModalOpen(false)
          onChanged()
        }}
      />

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete user"
      >
        <Stack gap="md">
          <Text size="sm">
            Permanently delete <strong>{user.name}</strong>? This cannot be
            undone.
          </Text>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              color="red"
              loading={pending === 'delete'}
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
