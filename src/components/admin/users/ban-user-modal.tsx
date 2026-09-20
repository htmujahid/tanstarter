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
          ? `Ban ${users[0].name}`
          : `Ban ${users.length} users`
      }
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
                setError(failed.error.message ?? 'Unable to ban user')
                return
              }

              onChanged()
            }}
          >
            {users.length === 1 ? 'Ban user' : `Ban ${users.length} users`}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
