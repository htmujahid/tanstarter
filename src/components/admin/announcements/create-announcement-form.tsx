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
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
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
            : t('announcements.createForm.createError'),
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
      title={t('announcements.addAnnouncement')}
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
                value ? undefined : t('announcements.fields.titleRequired'),
            }}
          >
            {(field) => (
              <TextInput
                label={t('announcements.fields.titleLabel')}
                placeholder={t('announcements.fields.titlePlaceholder')}
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
                label={t('announcements.fields.bodyLabel')}
                placeholder={t('announcements.fields.bodyPlaceholder')}
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
                label={t('announcements.statusPublished')}
                description={t('announcements.fields.publishedDescription')}
                checked={field.state.value}
                onChange={(event) =>
                  field.handleChange(event.currentTarget.checked)
                }
              />
            )}
          </form.Field>

          <Group justify="flex-end">
            <Button variant="subtle" onClick={onClose}>
              {tCommon('actions.cancel')}
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
                  {t('announcements.createForm.submitButton')}
                </Button>
              )}
            </form.Subscribe>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
