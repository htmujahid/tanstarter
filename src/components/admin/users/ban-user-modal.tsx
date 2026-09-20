import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  Textarea,
} from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { authClient } from '#/lib/auth-client'
import type { AdminUser } from '#/components/admin/users/users-table-column'

export function BanUserModal({
  users,
  onClose,
  onChanged,
}: {
  users: AdminUser[]
  onClose: () => void
  onChanged: () => void
}) {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const [reason, setReason] = useState('')
  const [days, setDays] = useState<number | string>('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const opened = users.length > 0

  useEffect(() => {
    if (opened) {
      setReason('')
      setDays('')
      setError(null)
    }
  }, [opened])

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        users.length === 1
          ? t('users.banModal.titleSingle', { name: users[0].name })
          : t('users.banModal.titleMultiple', { count: users.length })
      }
    >
      <Stack gap="md">
        {error && (
          <Alert color="red" icon={<IconAlertCircle size={16} />}>
            {error}
          </Alert>
        )}

        <Textarea
          label={t('users.banModal.reasonLabel')}
          placeholder={t('users.banModal.reasonPlaceholder')}
          value={reason}
          onChange={(event) => setReason(event.currentTarget.value)}
        />

        <NumberInput
          label={t('users.banModal.durationLabel')}
          description={t('users.banModal.durationDescription')}
          placeholder={t('users.banModal.durationPlaceholder')}
          min={1}
          value={days}
          onChange={setDays}
        />

        <Group justify="flex-end">
          <Button variant="subtle" onClick={onClose}>
            {tCommon('actions.cancel')}
          </Button>
          <Button
            color="red"
            loading={submitting}
            onClick={async () => {
              setSubmitting(true)
              const results = await Promise.all(
                users.map((user) =>
                  authClient.admin.banUser({
                    userId: user.id,
                    banReason: reason || undefined,
                    banExpiresIn:
                      typeof days === 'number' ? days * 86400 : undefined,
                  }),
                ),
              )
              setSubmitting(false)

              const failed = results.find((result) => result.error)
              if (failed?.error) {
                setError(failed.error.message ?? t('users.banModal.genericError'))
                return
              }

              onChanged()
            }}
          >
            {users.length === 1
              ? t('users.banModal.confirmButtonSingle')
              : t('users.banModal.confirmButtonMultiple', { count: users.length })}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
