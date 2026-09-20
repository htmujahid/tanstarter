import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import {
  Alert,
  Button,
  Card,
  Group,
  PasswordInput,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react'
import { authClient } from '#/lib/auth-client'

export function SetUserPasswordForm({ userId }: { userId: string }) {
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm({
    defaultValues: { newPassword: '', confirmPassword: '' },
    onSubmit: async ({ value }) => {
      setFormError(null)
      setSuccess(false)

      if (value.newPassword !== value.confirmPassword) {
        setFormError('Passwords do not match')
        return
      }

      const { error } = await authClient.admin.setUserPassword({
        userId,
        newPassword: value.newPassword,
      })

      if (error) {
        setFormError(error.message ?? 'Unable to update password')
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
            <Title order={4}>Password</Title>
            <Text c="dimmed" size="sm">
              Set a new password for this user.
            </Text>
          </Stack>

          {formError && (
            <Alert color="red" icon={<IconAlertCircle size={16} />}>
              {formError}
            </Alert>
          )}

          {success && (
            <Alert color="green" icon={<IconCircleCheck size={16} />}>
              Password updated successfully
            </Alert>
          )}

          <form.Field
            name="newPassword"
            validators={{
              onChange: ({ value }) =>
                value.length >= 8
                  ? undefined
                  : 'Password must be at least 8 characters',
            }}
          >
            {(field) => (
              <PasswordInput
                label="New password"
                placeholder="At least 8 characters"
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
                value ? undefined : 'Confirm the new password',
            }}
          >
            {(field) => (
              <PasswordInput
                label="Confirm new password"
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
                  Update password
                </Button>
              )}
            </form.Subscribe>
          </Group>
        </Stack>
      </form>
    </Card>
  )
}
