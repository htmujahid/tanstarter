import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import {
  Alert,
  Button,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { signIn } from '#/lib/auth-client'

export const Route = createFileRoute('/auth/sign-in')({ component: SignIn })

function SignIn() {
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

      await navigate({ to: '/' })
    },
  })

  return (
    <Stack gap="xl">
      <Stack gap={4}>
        <Title order={2}>Welcome back</Title>
        <Text c="dimmed" size="sm">
          Sign in to your account to continue
        </Text>
      </Stack>

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
              onChange: ({ value }) =>
                value ? undefined : 'Email is required',
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
    </Stack>
  )
}
