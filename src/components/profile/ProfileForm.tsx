import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
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
import { authClient } from '#/lib/auth-client'
import type { Session } from '#/server/auth/auth'

const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/

function validateUsername(value: string) {
  if (!value) return 'Username is required'
  if (value.length < 3) return 'Username must be at least 3 characters'
  if (value.length > 30) return 'Username must be at most 30 characters'
  if (!USERNAME_PATTERN.test(value))
    return 'Only letters, numbers, and underscores are allowed'
  return undefined
}

export default function ProfileForm({
  user,
}: {
  user: NonNullable<Session>['user']
}) {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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
        setFormError(error.message ?? 'Unable to update profile')
        return
      }

      setSuccess(true)
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
            <Title order={3}>Profile information</Title>
            <Text c="dimmed" size="sm">
              Update your name and username.
            </Text>
          </Stack>

          {formError && (
            <Alert color="red" icon={<IconAlertCircle size={16} />}>
              {formError}
            </Alert>
          )}

          {success && (
            <Alert color="green" icon={<IconCircleCheck size={16} />}>
              Profile updated successfully
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
                label="Username"
                description="Letters, numbers, and underscores only. Used to sign in."
                placeholder="janedoe"
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
                  Save changes
                </Button>
              )}
            </form.Subscribe>
          </Group>
        </Stack>
      </form>
    </Card>
  )
}
