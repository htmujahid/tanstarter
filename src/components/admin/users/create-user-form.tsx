import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import {
  Alert,
  Button,
  Group,
  Modal,
  PasswordInput,
  Select,
  Stack,
  TextInput,
} from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { authClient } from '#/lib/auth-client'

export function CreateUserForm({
  opened,
  onClose,
  onCreated,
}: {
  opened: boolean
  onClose: () => void
  onCreated: () => void
}) {
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { name: '', email: '', password: '', role: 'user' },
    onSubmit: async ({ value }) => {
      setFormError(null)

      const { error } = await authClient.admin.createUser({
        name: value.name,
        email: value.email,
        password: value.password,
        role: value.role as 'admin' | 'user',
      })

      if (error) {
        setFormError(error.message ?? 'Unable to create user')
        return
      }

      form.reset()
      onCreated()
    },
  })

  return (
    <Modal
      opened={opened}
      onClose={() => {
        form.reset()
        setFormError(null)
        onClose()
      }}
      title="Add user"
    >
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
                autoComplete="off"
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
                value ? undefined : 'Email is required',
            }}
          >
            {(field) => (
              <TextInput
                label="Email"
                placeholder="you@example.com"
                autoComplete="off"
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

          <form.Field name="role">
            {(field) => (
              <Select
                label="Role"
                data={[
                  { value: 'user', label: 'User' },
                  { value: 'admin', label: 'Admin' },
                ]}
                value={field.state.value}
                onChange={(value) => field.handleChange(value ?? 'user')}
                allowDeselect={false}
              />
            )}
          </form.Field>

          <Group justify="flex-end">
            <Button variant="subtle" onClick={onClose}>
              Cancel
            </Button>
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
                  Create user
                </Button>
              )}
            </form.Subscribe>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
