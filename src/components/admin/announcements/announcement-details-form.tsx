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
import { useTranslation } from 'react-i18next'
import { updateAnnouncementFn } from '#/server/actions/announcements'
import { announcementQueryOptions } from '#/lib/queries/announcements'

export function AnnouncementDetailsForm({
  announcementId,
  onSaved,
}: {
  announcementId: number
  onSaved: () => void
}) {
  const { t } = useTranslation('admin')
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
            : t('announcements.detail.updateError'),
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
            <Title order={4}>{t('announcements.detail.title')}</Title>
            <Text c="dimmed" size="sm">
              {t('announcements.detail.description')}
            </Text>
          </Stack>

          {formError && (
            <Alert color="red" icon={<IconAlertCircle size={16} />}>
              {formError}
            </Alert>
          )}

          {success && (
            <Alert color="green" icon={<IconCircleCheck size={16} />}>
              {t('announcements.detail.updateSuccess')}
            </Alert>
          )}

          <form.Field
            name="title"
            validators={{
              onChange: ({ value }) =>
                value ? undefined : t('announcements.fields.titleRequired'),
            }}
          >
            {(field) => (
              <TextInput
                label={t('announcements.fields.titleLabel')}
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
                label={t('announcements.fields.bodyLabel')}
                placeholder={t('announcements.fields.bodyPlaceholder')}
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
                label={t('announcements.statusPublished')}
                description={t('announcements.fields.publishedDescription')}
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
                  {t('announcements.detail.saveButton')}
                </Button>
              )}
            </form.Subscribe>
          </Group>
        </Stack>
      </form>
    </Card>
  )
}
