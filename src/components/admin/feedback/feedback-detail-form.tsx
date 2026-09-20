import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import {
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react'
import { updateFeedbackStatusFn } from '#/server/actions/feedback'
import { feedbackQueryOptions } from '#/lib/queries/feedback'
import { FEEDBACK_STATUSES } from '#/server/db/schemas'
import type { FeedbackStatus } from '#/server/db/schemas'

const CATEGORY_COLORS: Record<string, string> = {
  bug: 'red',
  feature: 'blue',
  general: 'gray',
}

export function FeedbackDetailForm({
  feedbackId,
  onSaved,
}: {
  feedbackId: number
  onSaved: () => void
}) {
  const { data: feedback } = useSuspenseQuery(feedbackQueryOptions(feedbackId))
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm({
    defaultValues: { status: feedback.status as FeedbackStatus },
    onSubmit: async ({ value }) => {
      setFormError(null)
      setSuccess(false)

      try {
        await updateFeedbackStatusFn({
          data: { id: feedback.id, status: value.status },
        })
      } catch (error) {
        setFormError(
          error instanceof Error ? error.message : 'Unable to update status',
        )
        return
      }

      setSuccess(true)
      onSaved()
    },
  })

  return (
    <Card withBorder radius="md" padding="lg">
      <Stack gap="md">
        <Stack gap={2}>
          <Group gap="xs" align="center">
            <Title order={4}>Feedback</Title>
            <Badge
              color={CATEGORY_COLORS[feedback.category] ?? 'gray'}
              variant="light"
              size="sm"
            >
              {feedback.category}
            </Badge>
          </Group>
          <Text c="dimmed" size="sm">
            Submitted by {feedback.submitterName} ({feedback.submitterEmail})
          </Text>
        </Stack>

        <Text style={{ whiteSpace: 'pre-wrap' }}>{feedback.message}</Text>

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

            {success && (
              <Alert color="green" icon={<IconCircleCheck size={16} />}>
                Status updated successfully
              </Alert>
            )}

            <form.Field name="status">
              {(field) => (
                <Select
                  label="Status"
                  data={FEEDBACK_STATUSES.map((value) => ({
                    value,
                    label: value,
                  }))}
                  value={field.state.value}
                  onChange={(value) => {
                    setSuccess(false)
                    field.handleChange(value ?? 'new')
                  }}
                  allowDeselect={false}
                  w={220}
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
                    Save status
                  </Button>
                )}
              </form.Subscribe>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Card>
  )
}
