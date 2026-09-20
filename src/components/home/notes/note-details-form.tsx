import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
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
import { useTranslation } from 'react-i18next'
import { updateNoteFn } from '#/server/actions/notes'
import { noteQueryOptions } from '#/lib/queries/notes'

export function NoteDetailsForm({
  noteId,
  onSaved,
}: {
  noteId: number
  onSaved: () => void
}) {
  const { t } = useTranslation('home')
  const { data: note } = useSuspenseQuery(noteQueryOptions(noteId))
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
          error instanceof Error
            ? error.message
            : t('notes.detailsForm.genericError'),
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
            <Title order={4}>{t('notes.detailsForm.title')}</Title>
            <Text c="dimmed" size="sm">
              {t('notes.detailsForm.subtitle')}
            </Text>
          </Stack>

          {formError && (
            <Alert color="red" icon={<IconAlertCircle size={16} />}>
              {formError}
            </Alert>
          )}

          {success && (
            <Alert color="green" icon={<IconCircleCheck size={16} />}>
              {t('notes.detailsForm.updateSuccess')}
            </Alert>
          )}

          <form.Field
            name="title"
            validators={{
              onChange: ({ value }) =>
                value ? undefined : t('notes.form.titleRequired'),
            }}
          >
            {(field) => (
              <TextInput
                label={t('notes.form.titleLabel')}
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
                label={t('notes.form.bodyLabel')}
                placeholder={t('notes.form.bodyPlaceholder')}
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
                  {t('notes.detailsForm.submit')}
                </Button>
              )}
            </form.Subscribe>
          </Group>
        </Stack>
      </form>
    </Card>
  )
}
