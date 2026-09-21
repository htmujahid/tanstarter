import { useRef, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useLiveQuery } from '@tanstack/react-db'
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
import { useTranslation } from 'react-i18next'
import { createFeedbackFn } from '#/server/actions/feedback.action'
import { FEEDBACK_CATEGORIES } from '#/server/db/schemas'
import { feedbackDraftCollection } from '#/lib/collections/feedback-draft.collection'
import type { FeedbackDraft } from '#/lib/collections/feedback-draft.collection'

const FEEDBACK_DRAFT_EMPTY: Omit<FeedbackDraft, 'id'> = {
  category: 'general',
  message: '',
}

export function CreateFeedbackForm({
  opened,
  onClose,
  onCreated,
}: {
  opened: boolean
  onClose: () => void
  onCreated: () => void
}) {
  const { t } = useTranslation('site')
  const { data: draftRows } = useLiveQuery({
    query: (q) => q.from({ draft: feedbackDraftCollection }),
  })

  // The modal's content stays mounted across open/close (only `opened`
  // toggles). Remount the form body on each open (via `key`) so `useForm`
  // picks up whatever's currently in the draft collection as its initial
  // values — more reliable than calling form.reset(values) after the fact.
  const openKeyRef = useRef(0)
  const wasOpenedRef = useRef(opened)
  if (opened && !wasOpenedRef.current) openKeyRef.current += 1
  wasOpenedRef.current = opened

  return (
    <Modal opened={opened} onClose={onClose} title={t('feedback.sendFeedback')}>
      <FeedbackFormBody
        key={openKeyRef.current}
        draftRows={draftRows}
        onClose={onClose}
        onCreated={onCreated}
      />
    </Modal>
  )
}

function FeedbackFormBody({
  draftRows,
  onClose,
  onCreated,
}: {
  draftRows: FeedbackDraft[]
  onClose: () => void
  onCreated: () => void
}) {
  const { t } = useTranslation('site')
  const { t: tCommon } = useTranslation('common')
  const [formError, setFormError] = useState<string | null>(null)
  const existingDraft = draftRows[0]

  function patchDraft(patch: Partial<Omit<FeedbackDraft, 'id'>>) {
    if (draftRows.length === 0) {
      feedbackDraftCollection.insert({
        id: 'feedback',
        ...FEEDBACK_DRAFT_EMPTY,
        ...patch,
      })
    } else {
      feedbackDraftCollection.update('feedback', (draft) => {
        Object.assign(draft, patch)
      })
    }
  }

  const form = useForm({
    defaultValues:
      draftRows.length === 0
        ? FEEDBACK_DRAFT_EMPTY
        : { category: existingDraft.category, message: existingDraft.message },
    onSubmit: async ({ value }) => {
      setFormError(null)

      try {
        await createFeedbackFn({
          data: { category: value.category, message: value.message },
        })
      } catch (error) {
        setFormError(
          error instanceof Error ? error.message : t('feedback.genericError'),
        )
        return
      }

      if (draftRows.length > 0) feedbackDraftCollection.delete('feedback')
      onCreated()
    },
  })

  return (
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
              label={t('feedback.categoryLabel')}
              data={FEEDBACK_CATEGORIES.map((value) => ({
                value,
                label: t(`feedback.categories.${value}`),
              }))}
              value={field.state.value}
              onChange={(value) => {
                const category = value ?? 'general'
                field.handleChange(category)
                patchDraft({ category })
              }}
              allowDeselect={false}
            />
          )}
        </form.Field>

        <form.Field
          name="message"
          validators={{
            onChange: ({ value }) =>
              value ? undefined : t('feedback.messageRequired'),
          }}
        >
          {(field) => (
            <Textarea
              label={t('feedback.messageLabel')}
              placeholder={t('feedback.messagePlaceholder')}
              autosize
              minRows={4}
              required
              value={field.state.value}
              onChange={(event) => {
                const value = event.currentTarget.value
                field.handleChange(value)
                patchDraft({ message: value })
              }}
              onBlur={field.handleBlur}
              error={field.state.meta.errors[0]}
            />
          )}
        </form.Field>

        <Group justify="flex-end">
          <Button variant="subtle" onClick={onClose}>
            {tCommon('actions.cancel')}
          </Button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" loading={isSubmitting} disabled={!canSubmit}>
                {t('feedback.sendFeedback')}
              </Button>
            )}
          </form.Subscribe>
        </Group>
      </Stack>
    </form>
  )
}
