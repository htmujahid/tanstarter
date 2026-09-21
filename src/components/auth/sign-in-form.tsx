import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { Alert, Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { PasskeySignInButton } from '#/components/auth/passkey-sign-in-button'
import { signIn } from '#/lib/auth-client'
import { CURRENT_SESSION_QUERY_KEY } from '#/lib/queries/session.query'

export function SignInForm() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { identifier: '', password: '' },
    onSubmit: async ({ value }) => {
      setFormError(null)

      const { error } = value.identifier.includes('@')
        ? await signIn.email({
            email: value.identifier,
            password: value.password,
          })
        : await signIn.username({
            username: value.identifier,
            password: value.password,
          })

      if (error) {
        setFormError(error.message ?? t('signIn.genericError'))
        return
      }

      await queryClient.invalidateQueries({
        queryKey: CURRENT_SESSION_QUERY_KEY,
      })
      await navigate({ to: '/home' })
    },
  })

  return (
    <Stack gap="md">
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
            name="identifier"
            validators={{
              onChange: ({ value }) =>
                value ? undefined : t('signIn.identifierRequired'),
            }}
          >
            {(field) => (
              <TextInput
                label={t('signIn.identifierLabel')}
                placeholder={t('signIn.identifierPlaceholder')}
                autoComplete="username webauthn"
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
                value ? undefined : t('signIn.passwordRequired'),
            }}
          >
            {(field) => (
              <PasswordInput
                label={t('signIn.passwordLabel')}
                placeholder={t('signIn.passwordPlaceholder')}
                autoComplete="current-password"
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
            selector={(state) =>
              [state.canSubmit, state.isSubmitting] as const
            }
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={!canSubmit}
                fullWidth
                mt="sm"
              >
                {t('signIn.submit')}
              </Button>
            )}
          </form.Subscribe>
        </Stack>
      </form>

      <PasskeySignInButton />
    </Stack>
  )
}
