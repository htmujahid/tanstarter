import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import {
  Alert,
  Button,
  Group,
  Modal,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { createNoteFn } from '#/server/actions/notes'

export function CreateNoteForm({
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
    defaultValues: { title: '', body: '' },
    onSubmit: async ({ value }) => {
      setFormError(null)

      try {
        await createNoteFn({
          data: { title: value.title, body: value.body || undefined },
        })
      } catch (error) {
        setFormError(
          error instanceof Error ? error.message : 'Unable to create note',
        )
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
      title="Add note"
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
            name="title"
            validators={{
              onChange: ({ value }) =>
                value ? undefined : 'Title is required',
            }}
          >
            {(field) => (
              <TextInput
                label="Title"
                placeholder="Note title"
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

          <form.Field name="body">
            {(field) => (
              <Textarea
                label="Body"
                placeholder="Optional"
                autosize
                minRows={3}
                value={field.state.value}
                onChange={(event) =>
                  field.handleChange(event.currentTarget.value)
                }
                onBlur={field.handleBlur}
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
                  Create note
                </Button>
              )}
            </form.Subscribe>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
