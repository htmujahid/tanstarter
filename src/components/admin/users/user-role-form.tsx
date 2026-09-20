import { useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Group,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react'
import { authClient } from '#/lib/auth-client'
import type { Session } from '#/server/auth/auth'

export function UserRoleForm({
  user,
  disabled,
  onSaved,
}: {
  user: NonNullable<Session>['user']
  disabled?: boolean
  onSaved: () => void
}) {
  const [role, setRole] = useState(user.role ?? 'user')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  return (
    <Card withBorder radius="md" padding="lg">
      <Stack gap="md">
        <Stack gap={2}>
          <Title order={4}>Role</Title>
          <Text c="dimmed" size="sm">
            Controls what this user can access.
          </Text>
        </Stack>

        {error && (
          <Alert color="red" icon={<IconAlertCircle size={16} />}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert color="green" icon={<IconCircleCheck size={16} />}>
            Role updated successfully
          </Alert>
        )}

        {disabled && (
          <Text size="sm" c="dimmed">
            You can&apos;t change your own role.
          </Text>
        )}

        <Select
          label="Role"
          data={[
            { value: 'user', label: 'User' },
            { value: 'admin', label: 'Admin' },
          ]}
          value={role}
          onChange={(value) => {
            setSuccess(false)
            setRole(value ?? 'user')
          }}
          allowDeselect={false}
          disabled={disabled}
        />

        <Group justify="flex-end">
          <Button
            loading={submitting}
            disabled={disabled || role === (user.role ?? 'user')}
            onClick={async () => {
              setSubmitting(true)
              setError(null)
              const { error: err } = await authClient.admin.setRole({
                userId: user.id,
                role: role as 'admin' | 'user',
              })
              setSubmitting(false)

              if (err) {
                setError(err.message ?? 'Unable to change role')
                return
              }

              setSuccess(true)
              onSaved()
            }}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </Card>
  )
}
