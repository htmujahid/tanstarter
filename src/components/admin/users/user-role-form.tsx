import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
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
import { useTranslation } from 'react-i18next'
import { authClient } from '#/lib/auth-client'
import { useSession } from '#/hooks/use-session'
import { userQueryOptions } from '#/lib/queries/admin.query'

export function UserRoleForm({
  userId,
  onSaved,
}: {
  userId: string
  onSaved: () => void
}) {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const { data: user } = useSuspenseQuery(userQueryOptions(userId))
  const session = useSession()
  const disabled = user.id === session?.user.id

  const [role, setRole] = useState(user.role ?? 'user')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  return (
    <Card withBorder radius="md" padding="lg">
      <Stack gap="md">
        <Stack gap={2}>
          <Title order={4}>{t('users.detail.roleForm.title')}</Title>
          <Text c="dimmed" size="sm">
            {t('users.detail.roleForm.description')}
          </Text>
        </Stack>

        {error && (
          <Alert color="red" icon={<IconAlertCircle size={16} />}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert color="green" icon={<IconCircleCheck size={16} />}>
            {t('users.detail.roleForm.successMessage')}
          </Alert>
        )}

        {disabled && (
          <Text size="sm" c="dimmed">
            {t('users.detail.roleForm.selfNotice')}
          </Text>
        )}

        <Select
          label={t('users.detail.roleForm.roleLabel')}
          data={[
            { value: 'user', label: t('users.roles.user') },
            { value: 'admin', label: t('users.roles.admin') },
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
                setError(err.message ?? t('users.detail.roleForm.genericError'))
                return
              }

              setSuccess(true)
              onSaved()
            }}
          >
            {tCommon('actions.save')}
          </Button>
        </Group>
      </Stack>
    </Card>
  )
}
