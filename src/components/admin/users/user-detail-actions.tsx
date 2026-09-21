import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Alert, Button, Group, Modal, Stack, Text } from '@mantine/core'
import {
  IconAlertCircle,
  IconBan,
  IconTrash,
  IconUserCheck,
  IconUserShield,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { authClient } from '#/lib/auth-client'
import { BanUserModal } from '#/components/admin/users/ban-user-modal'
import { useSession } from '#/hooks/use-session'
import { userQueryOptions } from '#/lib/queries/admin'
import { CURRENT_SESSION_QUERY_KEY } from '#/lib/queries/session'

export function UserDetailActions({
  userId,
  onChanged,
}: {
  userId: string
  onChanged: () => void
}) {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const { data: user } = useSuspenseQuery(userQueryOptions(userId))
  const session = useSession()
  const isSelf = user.id === session?.user.id
  const navigate = useNavigate()
  const queryClient = useQueryClient()
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
        (error as { message?: string }).message ??
          tCommon('messages.somethingWentWrong'),
      )
      return false
    }

    return true
  }

  async function handleImpersonate() {
    const ok = await run('impersonate', () =>
      authClient.admin.impersonateUser({ userId: user.id }),
    )
    if (ok) {
      await queryClient.invalidateQueries({
        queryKey: CURRENT_SESSION_QUERY_KEY,
      })
      await navigate({ to: '/home' })
    }
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
          {t('users.actions.impersonateButton')}
        </Button>

        {isBanned ? (
          <Button
            variant="light"
            color="teal"
            leftSection={<IconUserCheck size={16} />}
            loading={pending === 'unban'}
            onClick={handleUnban}
          >
            {t('users.actions.unbanButton')}
          </Button>
        ) : (
          <Button
            variant="light"
            color="red"
            leftSection={<IconBan size={16} />}
            onClick={() => setBanModalOpen(true)}
          >
            {t('users.actions.banButton')}
          </Button>
        )}

        <Button
          variant="light"
          color="red"
          leftSection={<IconTrash size={16} />}
          onClick={() => setDeleteModalOpen(true)}
        >
          {tCommon('actions.delete')}
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
        users={banModalOpen ? [user] : []}
        onClose={() => setBanModalOpen(false)}
        onChanged={() => {
          setBanModalOpen(false)
          onChanged()
        }}
      />

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={tCommon('confirmDelete.title', { item: user.name })}
      >
        <Stack gap="md">
          <Text size="sm">{tCommon('confirmDelete.description')}</Text>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setDeleteModalOpen(false)}>
              {tCommon('actions.cancel')}
            </Button>
            <Button
              color="red"
              loading={pending === 'delete'}
              onClick={handleDelete}
            >
              {tCommon('actions.delete')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
}
