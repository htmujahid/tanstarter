import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import {
  Alert,
  Button,
  Group,
  Modal,
  Stack,
  Switch,
  Textarea,
  TextInput,
} from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { createAnnouncementFn } from '#/server/actions/announcements'

export function CreateAnnouncementForm({
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
    defaultValues: { title: '', body: '', published: false },
    onSubmit: async ({ value }) => {
      setFormError(null)

      try {
        await createAnnouncementFn({
          data: {
            title: value.title,
            body: value.body || undefined,
            published: value.published,
          },
        })
      } catch (error) {
        setFormError(
          error instanceof Error
            ? error.message
            : 'Unable to create announcement',
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
      title="Add announcement"
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
                placeholder="Announcement title"
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

          <form.Field name="published">
            {(field) => (
              <Switch
                label="Published"
                description="Visible to everyone. Leave off to save as a draft."
                checked={field.state.value}
                onChange={(event) =>
                  field.handleChange(event.currentTarget.checked)
                }
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
                  Create announcement
                </Button>
              )}
            </form.Subscribe>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
