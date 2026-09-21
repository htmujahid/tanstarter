import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
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
import { useTranslation } from 'react-i18next'
import { authClient } from '#/lib/auth-client'
import { BanUserModal } from '#/components/admin/users/ban-user-modal'
import { CURRENT_SESSION_QUERY_KEY } from '#/lib/queries/session.query'
import type { AdminUser } from '#/components/admin/users/users-table-column'

export function UsersBulkActionBar({
  users,
  onClearSelection,
  onChanged,
}: {
  users: AdminUser[]
  onClearSelection: () => void
  onChanged: () => void
}) {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
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
        (error as { message?: string }).message ??
          tCommon('messages.somethingWentWrong'),
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
    if (ok) {
      await queryClient.invalidateQueries({
        queryKey: CURRENT_SESSION_QUERY_KEY,
      })
      await navigate({ to: '/home' })
    }
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
          {tCommon('table.rowsSelected', { count: users.length })}
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
            {t('users.actions.impersonateButton')}
          </Button>
        )}

        {hasActiveSelected && (
          <Button
            variant="default"
            size="compact-sm"
            leftSection={<IconBan size={14} />}
            onClick={() => setBanUsers(users.filter((user) => !user.banned))}
          >
            {t('users.actions.banButton')}
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
            {t('users.actions.unbanButton')}
          </Button>
        )}

        <Button
          variant="default"
          color="red"
          size="compact-sm"
          leftSection={<IconTrash size={14} />}
          onClick={() => setDeleteUsers(users)}
        >
          {tCommon('actions.delete')}
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
        title={tCommon('confirmDelete.title', {
          item:
            deleteUsers.length === 1
              ? deleteUsers[0].name
              : t('users.bulkActions.usersCountLabel', {
                  count: deleteUsers.length,
                }),
        })}
      >
        <Stack gap="md">
          <Text size="sm">{tCommon('confirmDelete.description')}</Text>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setDeleteUsers([])}>
              {tCommon('actions.cancel')}
            </Button>
            <Button color="red" onClick={handleBulkDelete}>
              {tCommon('actions.delete')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}
