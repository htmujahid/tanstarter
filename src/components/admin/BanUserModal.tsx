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
import type { AdminUser } from '#/components/admin/UsersTableColumn'

export default function BanUserModal({
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
