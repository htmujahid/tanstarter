import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
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
import { userQueryOptions } from '#/lib/queries/admin'

export function UserDetailsForm({
  userId,
  onSaved,
}: {
  userId: string
  onSaved: () => void
}) {
  const { t } = useTranslation('admin')
  const { data: user } = useSuspenseQuery(userQueryOptions(userId))
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      username: user.username ?? '',
    },
    onSubmit: async ({ value }) => {
      setFormError(null)
      setSuccess(false)

      const { error } = await authClient.admin.updateUser({
        userId: user.id,
        data: {
          name: value.name,
          email: value.email,
          username: value.username || null,
        },
      })

      if (error) {
        setFormError(error.message ?? t('users.detail.detailsForm.genericError'))
        return
      }

      setSuccess(true)
      onSaved()
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
            <Title order={4}>{t('users.detail.detailsForm.title')}</Title>
            <Text c="dimmed" size="sm">
              {t('users.detail.detailsForm.description')}
            </Text>
          </Stack>

          {formError && (
            <Alert color="red" icon={<IconAlertCircle size={16} />}>
              {formError}
            </Alert>
          )}

          {success && (
            <Alert color="green" icon={<IconCircleCheck size={16} />}>
              {t('users.detail.detailsForm.successMessage')}
            </Alert>
          )}

          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                value ? undefined : t('users.detail.detailsForm.nameRequired'),
            }}
          >
            {(field) => (
              <TextInput
                label={t('users.detail.detailsForm.nameLabel')}
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
            name="email"
            validators={{
              onChange: ({ value }) =>
                value ? undefined : t('users.detail.detailsForm.emailRequired'),
            }}
          >
            {(field) => (
              <TextInput
                label={t('users.detail.detailsForm.emailLabel')}
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

          <form.Field name="username">
            {(field) => (
              <TextInput
                label={t('users.detail.detailsForm.usernameLabel')}
                placeholder={t('users.detail.detailsForm.usernamePlaceholder')}
                value={field.state.value}
                onChange={(event) => {
                  setSuccess(false)
                  field.handleChange(event.currentTarget.value)
                }}
                onBlur={field.handleBlur}
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
                  {t('users.detail.detailsForm.submitButton')}
                </Button>
              )}
            </form.Subscribe>
          </Group>
        </Stack>
      </form>
    </Card>
  )
}
