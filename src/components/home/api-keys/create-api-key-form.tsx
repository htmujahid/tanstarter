import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import {
  Alert,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  TextInput,
} from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { authClient } from '#/lib/auth-client'

const EXPIRATION_OPTIONS = [
  { value: 'never', label: 'Never' },
  { value: String(30 * 24 * 60 * 60), label: '30 days' },
  { value: String(90 * 24 * 60 * 60), label: '90 days' },
  { value: String(365 * 24 * 60 * 60), label: '1 year' },
]

export function CreateApiKeyForm({
  opened,
  onClose,
  onCreated,
}: {
  opened: boolean
  onClose: () => void
  onCreated: (key: string) => void
}) {
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { name: '', expiration: 'never' },
    onSubmit: async ({ value }) => {
      setFormError(null)

      const { data, error } = await authClient.apiKey.create({
        name: value.name,
        expiresIn:
          value.expiration === 'never' ? null : Number(value.expiration),
      })

      if (error) {
        setFormError(error.message ?? 'Unable to create API key')
        return
      }

      form.reset()
      onCreated(data.key)
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
      title="Create an API key"
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
                placeholder="e.g. CI pipeline"
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

          <form.Field name="expiration">
            {(field) => (
              <Select
                label="Expiration"
                data={EXPIRATION_OPTIONS}
                value={field.state.value}
                onChange={(value) => field.handleChange(value ?? 'never')}
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
                  Create key
                </Button>
              )}
            </form.Subscribe>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
