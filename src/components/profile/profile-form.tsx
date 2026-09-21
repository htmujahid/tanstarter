import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import {
  Alert,
  Button,
  Card,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { authClient } from '#/lib/auth-client'
import { CURRENT_SESSION_QUERY_KEY } from '#/lib/queries/session.query'
import type { Session } from '#/server/auth/auth'

const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/

export function ProfileForm({ user }: { user: NonNullable<Session>['user'] }) {
  const { t } = useTranslation('profile')
  const router = useRouter()
  const queryClient = useQueryClient()
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function validateUsername(value: string) {
    if (!value) return t('profileForm.usernameRequired')
    if (value.length < 3) return t('profileForm.usernameTooShort')
    if (value.length > 30) return t('profileForm.usernameTooLong')
    if (!USERNAME_PATTERN.test(value)) return t('profileForm.usernameInvalid')
    return undefined
  }

  const form = useForm({
    defaultValues: {
      name: user.name,
      username: user.username ?? '',
    },
    onSubmit: async ({ value }) => {
      setFormError(null)
      setSuccess(false)

      const { error } = await authClient.updateUser({
        name: value.name,
        username: value.username,
      })

      if (error) {
        setFormError(error.message ?? t('profileForm.genericError'))
        return
      }

      setSuccess(true)
      await queryClient.invalidateQueries({
        queryKey: CURRENT_SESSION_QUERY_KEY,
      })
      await router.invalidate()
    },
  })

  return (
    <Card withBorder radius="md" padding="lg">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <Stack gap="md">
          <Stack gap={2}>
            <Title order={3}>{t('profileForm.title')}</Title>
            <Text c="dimmed" size="sm">
              {t('profileForm.subtitle')}
            </Text>
          </Stack>

          {formError && (
            <Alert color="red" icon={<IconAlertCircle size={16} />}>
              {formError}
            </Alert>
          )}

          {success && (
            <Alert color="green" icon={<IconCircleCheck size={16} />}>
              {t('profileForm.successMessage')}
            </Alert>
          )}

          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                value ? undefined : t('profileForm.nameRequired'),
            }}
          >
            {(field) => (
              <TextInput
                label={t('profileForm.nameLabel')}
                placeholder={t('profileForm.namePlaceholder')}
                autoComplete="name"
                required
                value={field.state.value}
                onChange={(event) => {
                  setSuccess(false)
                  field.handleChange(event.currentTarget.value)
                }}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]}
              />
            )}
          </form.Field>

          <form.Field
            name="username"
            validators={{
              onChange: ({ value }) => validateUsername(value),
            }}
          >
            {(field) => (
              <TextInput
                label={t('profileForm.usernameLabel')}
                description={t('profileForm.usernameDescription')}
                placeholder={t('profileForm.usernamePlaceholder')}
                autoComplete="username"
                required
                value={field.state.value}
                onChange={(event) => {
                  setSuccess(false)
                  field.handleChange(event.currentTarget.value)
                }}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]}
              />
            )}
          </form.Field>

          <Group justify="flex-end">
            <form.Subscribe
              selector={(state) =>
                [state.canSubmit, state.isSubmitting] as const
              }
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={!canSubmit}
                >
                  {t('profileForm.submit')}
                </Button>
              )}
            </form.Subscribe>
          </Group>
        </Stack>
      </form>
    </Card>
  )
}
