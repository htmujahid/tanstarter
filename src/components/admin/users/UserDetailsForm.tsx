import { useState } from 'react'
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

export default function UserDetailsForm({
  user,
  onSaved,
}: {
  user: NonNullable<Session>['user']
  onSaved: () => void
}) {
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
        setFormError(error.message ?? 'Unable to update user')
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
            <Title order={4}>User details</Title>
            <Text c="dimmed" size="sm">
              Update this user&apos;s name, email, and username.
            </Text>
          </Stack>

          {formError && (
            <Alert color="red" icon={<IconAlertCircle size={16} />}>
              {formError}
            </Alert>
          )}

          {success && (
            <Alert color="green" icon={<IconCircleCheck size={16} />}>
              User updated successfully
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
                value ? undefined : 'Email is required',
            }}
          >
            {(field) => (
              <TextInput
                label="Email"
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
                label="Username"
                placeholder="Optional"
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
