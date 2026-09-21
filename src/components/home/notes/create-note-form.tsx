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
import { useTranslation } from 'react-i18next'

import { useNotesCollection } from '#/lib/collections/notes.collection'
import {
  useOfflineExecutor,
  waitForTransaction,
} from '#/lib/db/offline-executor'

export function CreateNoteForm({
  opened,
  onClose,
  onCreated,
}: {
  opened: boolean
  onClose: () => void
  onCreated: () => void
}) {
  const { t } = useTranslation('home')
  const { t: tCommon } = useTranslation('common')
  const executor = useOfflineExecutor()
  const collection = useNotesCollection()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { title: '', body: '' },
    onSubmit: async ({ value }) => {
      setFormError(null)

      if (!executor) {
        setFormError(t('notes.createForm.genericError'))
        return
      }

      const now = new Date().toISOString()
      const offlineTx = executor.createOfflineTransaction({
        mutationFnName: 'createNote',
      })
      const tx = offlineTx.mutate(() => {
        collection.insert({
          id: -Date.now(),
          title: value.title,
          body: value.body || null,
          userId: '',
          createdAt: now,
          updatedAt: now,
        })
      })

      try {
        await waitForTransaction(tx)
      } catch (error) {
        setFormError(
          error instanceof Error
            ? error.message
            : t('notes.createForm.genericError'),
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
      title={t('notes.createForm.title')}
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
                value ? undefined : t('notes.form.titleRequired'),
            }}
          >
            {(field) => (
              <TextInput
                label={t('notes.form.titleLabel')}
                placeholder={t('notes.form.titlePlaceholder')}
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
                label={t('notes.form.bodyLabel')}
                placeholder={t('notes.form.bodyPlaceholder')}
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
                  {t('notes.createForm.submit')}
                </Button>
              )}
            </form.Subscribe>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
