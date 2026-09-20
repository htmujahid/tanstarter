import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Group,
  PasswordInput,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { authClient } from '#/lib/auth-client'

export function ChangePasswordForm() {
  const { t } = useTranslation('profile')
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      revokeOtherSessions: false,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)
      setSuccess(false)

      if (value.newPassword !== value.confirmPassword) {
        setFormError(t('changePasswordForm.passwordMismatch'))
        return
      }

      const { error } = await authClient.changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
        revokeOtherSessions: value.revokeOtherSessions,
      })

      if (error) {
        setFormError(error.message ?? t('changePasswordForm.genericError'))
        return
      }

      setSuccess(true)
      form.reset()
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
            <Title order={3}>{t('changePasswordForm.title')}</Title>
            <Text c="dimmed" size="sm">
              {t('changePasswordForm.subtitle')}
            </Text>
          </Stack>

          {formError && (
            <Alert color="red" icon={<IconAlertCircle size={16} />}>
              {formError}
            </Alert>
          )}

          {success && (
            <Alert color="green" icon={<IconCircleCheck size={16} />}>
              {t('changePasswordForm.successMessage')}
            </Alert>
          )}

          <form.Field
            name="currentPassword"
            validators={{
              onChange: ({ value }) =>
                value ? undefined : t('changePasswordForm.currentPasswordRequired'),
            }}
          >
            {(field) => (
              <PasswordInput
                label={t('changePasswordForm.currentPasswordLabel')}
                autoComplete="current-password"
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
            name="newPassword"
            validators={{
              onChange: ({ value }) =>
                value.length >= 8
                  ? undefined
                  : t('changePasswordForm.newPasswordTooShort'),
            }}
          >
            {(field) => (
              <PasswordInput
                label={t('changePasswordForm.newPasswordLabel')}
                placeholder={t('changePasswordForm.newPasswordPlaceholder')}
                autoComplete="new-password"
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
            name="confirmPassword"
            validators={{
              onChange: ({ value }) =>
                value ? undefined : t('changePasswordForm.confirmPasswordRequired'),
            }}
          >
            {(field) => (
              <PasswordInput
                label={t('changePasswordForm.confirmPasswordLabel')}
                placeholder={t('changePasswordForm.confirmPasswordPlaceholder')}
                autoComplete="new-password"
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

          <form.Field name="revokeOtherSessions">
            {(field) => (
              <Checkbox
                label={t('changePasswordForm.revokeOtherSessionsLabel')}
                checked={field.state.value}
                onChange={(event) =>
                  field.handleChange(event.currentTarget.checked)
                }
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
                  {t('changePasswordForm.submit')}
                </Button>
              )}
            </form.Subscribe>
          </Group>
        </Stack>
      </form>
    </Card>
  )
}
