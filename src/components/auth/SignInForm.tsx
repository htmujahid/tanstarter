import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { Alert, Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { signIn } from '#/lib/auth-client'

export default function SignInForm() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: async ({ value }) => {
      setFormError(null)

      const { error } = await signIn.email({
        email: value.email,
        password: value.password,
      })

      if (error) {
        setFormError(error.message ?? 'Unable to sign in')
        return
      }

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
          name="email"
          validators={{
            onChange: ({ value }) => (value ? undefined : 'Email is required'),
          }}
        >
          {(field) => (
            <TextInput
              label="Email"
              placeholder="you@example.com"
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
              value ? undefined : 'Password is required',
          }}
        >
          {(field) => (
            <PasswordInput
              label="Password"
              placeholder="Your password"
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
              Sign in
            </Button>
          )}
        </form.Subscribe>
      </Stack>
    </form>
  )
}
