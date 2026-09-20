import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import {
  Alert,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react'
import { updateNoteFn } from '#/server/actions/notes'
import type { Note } from '#/server/db'

export function NoteDetailsForm({
  note,
  onSaved,
}: {
  note: Note
  onSaved: () => void
}) {
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm({
    defaultValues: {
      title: note.title,
      body: note.body ?? '',
    },
    onSubmit: async ({ value }) => {
      setFormError(null)
      setSuccess(false)

      try {
        await updateNoteFn({
          data: {
            id: note.id,
            title: value.title,
            body: value.body || undefined,
          },
        })
      } catch (error) {
        setFormError(
          error instanceof Error ? error.message : 'Unable to update note',
        )
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
            <Title order={4}>Note details</Title>
            <Text c="dimmed" size="sm">
              Update this note&apos;s title and body.
            </Text>
          </Stack>

          {formError && (
            <Alert color="red" icon={<IconAlertCircle size={16} />}>
              {formError}
            </Alert>
          )}

          {success && (
            <Alert color="green" icon={<IconCircleCheck size={16} />}>
              Note updated successfully
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

          <form.Field name="body">
            {(field) => (
              <Textarea
                label="Body"
                placeholder="Optional"
                autosize
                minRows={4}
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
