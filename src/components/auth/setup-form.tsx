import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Alert, Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { signUp } from '#/lib/auth-client'
import { CURRENT_SESSION_QUERY_KEY } from '#/lib/queries/session.query'

export function SetupForm() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    onSubmit: async ({ value }) => {
      setFormError(null)

      if (value.password !== value.confirmPassword) {
        setFormError(t('setup.passwordMismatch'))
        return
      }

      const { error } = await signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
      })

      if (error) {
        setFormError(error.message ?? t('setup.genericError'))
        return
      }

      await queryClient.refetchQueries({
        queryKey: CURRENT_SESSION_QUERY_KEY,
      })
      await navigate({ to: '/home' })
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <Stack gap="md">
        {formError && (
          <Alert color="red" icon={<IconAlertCircle size={16} />}>
            {formError}
          </Alert>
        )}

        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) =>
              value ? undefined : t('setup.nameRequired'),
          }}
        >
          {(field) => (
            <TextInput
              label={t('setup.nameLabel')}
              placeholder={t('setup.namePlaceholder')}
              autoComplete="name"
              required
              value={field.state.value}
              onChange={(event) =>
                field.handleChange(event.currentTarget.value)
              }
              onBlur={field.handleBlur}
              error={field.state.meta.errors[0]}
            />
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) =>
              value ? undefined : t('setup.emailRequired'),
          }}
        >
          {(field) => (
            <TextInput
              label={t('setup.emailLabel')}
              placeholder={t('setup.emailPlaceholder')}
              autoComplete="email"
              required
              value={field.state.value}
              onChange={(event) =>
                field.handleChange(event.currentTarget.value)
              }
              onBlur={field.handleBlur}
              error={field.state.meta.errors[0]}
            />
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) =>
              value.length >= 8 ? undefined : t('setup.passwordTooShort'),
          }}
        >
          {(field) => (
            <PasswordInput
              label={t('setup.passwordLabel')}
              placeholder={t('setup.passwordPlaceholder')}
              autoComplete="new-password"
              required
              value={field.state.value}
              onChange={(event) =>
                field.handleChange(event.currentTarget.value)
              }
              onBlur={field.handleBlur}
              error={field.state.meta.errors[0]}
            />
          )}
        </form.Field>

        <form.Field
          name="confirmPassword"
          validators={{
            onChange: ({ value }) =>
              value ? undefined : t('setup.confirmPasswordRequired'),
          }}
        >
          {(field) => (
            <PasswordInput
              label={t('setup.confirmPasswordLabel')}
              placeholder={t('setup.confirmPasswordPlaceholder')}
              autoComplete="new-password"
              required
              value={field.state.value}
              onChange={(event) =>
                field.handleChange(event.currentTarget.value)
              }
              onBlur={field.handleBlur}
              error={field.state.meta.errors[0]}
            />
          )}
        </form.Field>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!canSubmit}
              fullWidth
              mt="sm"
            >
              {t('setup.submit')}
            </Button>
          )}
        </form.Subscribe>
      </Stack>
    </form>
  )
}
