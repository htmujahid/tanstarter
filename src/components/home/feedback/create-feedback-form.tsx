import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import {
  Alert,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Textarea,
} from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { createFeedbackFn } from '#/server/actions/feedback'
import { FEEDBACK_CATEGORIES } from '#/server/db/schemas'
import type { FeedbackCategory } from '#/server/db/schemas'

export function CreateFeedbackForm({
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
    defaultValues: {
      category: 'general' as FeedbackCategory,
      message: '',
    },
    onSubmit: async ({ value }) => {
      setFormError(null)

      try {
        await createFeedbackFn({
          data: { category: value.category, message: value.message },
        })
      } catch (error) {
        setFormError(
          error instanceof Error ? error.message : 'Unable to send feedback',
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
      title="Send feedback"
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

          <form.Field name="category">
            {(field) => (
              <Select
                label="Category"
                data={FEEDBACK_CATEGORIES.map((value) => ({
                  value,
                  label: value,
                }))}
                value={field.state.value}
                onChange={(value) => field.handleChange(value ?? 'general')}
                allowDeselect={false}
              />
            )}
          </form.Field>

          <form.Field
            name="message"
            validators={{
              onChange: ({ value }) =>
                value ? undefined : 'Message is required',
            }}
          >
            {(field) => (
              <Textarea
                label="Message"
                placeholder="Tell us what's on your mind"
                autosize
                minRows={4}
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
                  Send feedback
                </Button>
              )}
            </form.Subscribe>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
