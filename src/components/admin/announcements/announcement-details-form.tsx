import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import {
  Alert,
  Button,
  Card,
  Group,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react'
import { updateAnnouncementFn } from '#/server/actions/announcements'
import { announcementQueryOptions } from '#/lib/queries/announcements'

export function AnnouncementDetailsForm({
  announcementId,
  onSaved,
}: {
  announcementId: number
  onSaved: () => void
}) {
  const { data: announcement } = useSuspenseQuery(
    announcementQueryOptions(announcementId),
  )
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm({
    defaultValues: {
      title: announcement.title,
      body: announcement.body ?? '',
      published: announcement.published,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)
      setSuccess(false)

      try {
        await updateAnnouncementFn({
          data: {
            id: announcement.id,
            title: value.title,
            body: value.body || undefined,
            published: value.published,
          },
        })
      } catch (error) {
        setFormError(
          error instanceof Error
            ? error.message
            : 'Unable to update announcement',
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
            <Title order={4}>Announcement details</Title>
            <Text c="dimmed" size="sm">
              Update this announcement&apos;s content and visibility.
            </Text>
          </Stack>

          {formError && (
            <Alert color="red" icon={<IconAlertCircle size={16} />}>
              {formError}
            </Alert>
          )}

          {success && (
            <Alert color="green" icon={<IconCircleCheck size={16} />}>
              Announcement updated successfully
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

          <form.Field name="published">
            {(field) => (
              <Switch
                label="Published"
                description="Visible to everyone. Leave off to keep as a draft."
                checked={field.state.value}
                onChange={(event) => {
                  setSuccess(false)
                  field.handleChange(event.currentTarget.checked)
                }}
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
