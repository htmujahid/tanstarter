import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { Alert, Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { signUp } from '#/lib/auth-client'

export function SetupForm() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    onSubmit: async ({ value }) => {
      setFormError(null)

      if (value.password !== value.confirmPassword) {
        setFormError('Passwords do not match')
        return
      }

      const { error } = await signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
      })

      if (error) {
        setFormError(error.message ?? 'Unable to create the first user')
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
          name="name"
          validators={{
            onChange: ({ value }) => (value ? undefined : 'Name is required'),
          }}
        >
          {(field) => (
            <TextInput
              label="Name"
              placeholder="Jane Doe"
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
              value.length >= 8
                ? undefined
                : 'Password must be at least 8 characters',
          }}
        >
          {(field) => (
            <PasswordInput
              label="Password"
              placeholder="At least 8 characters"
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
              value ? undefined : 'Confirm your password',
          }}
        >
          {(field) => (
            <PasswordInput
              label="Confirm password"
              placeholder="Re-enter your password"
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
              Create account
            </Button>
          )}
        </form.Subscribe>
      </Stack>
    </form>
  )
}
