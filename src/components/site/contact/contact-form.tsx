import { useState } from 'react'
import { useLiveQuery } from '@tanstack/react-db'
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

import { contactDraftCollection } from '#/lib/collections/contact-draft.collection'
import type { ContactDraft } from '#/lib/collections/contact-draft.collection'
import { createContactSubmissionFn } from '#/server/actions/contact.action'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const CONTACT_DRAFT_EMPTY: Omit<ContactDraft, 'id'> = {
  name: '',
  email: '',
  message: '',
}

export function ContactForm() {
  const { data: draftRows, isReady } = useLiveQuery({
    query: (q) => q.from({ draft: contactDraftCollection }),
  })

  if (!isReady) {
    return <Card withBorder radius="md" padding="lg" mih={340} />
  }

  return <ContactFormBody draftRows={draftRows} />
}

function ContactFormBody({ draftRows }: { draftRows: ContactDraft[] }) {
  const { t } = useTranslation('site')
  const { t: tCommon } = useTranslation('common')
  const [formError, setFormError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const existingDraft = draftRows[0]

  function patchDraft(patch: Partial<Omit<ContactDraft, 'id'>>) {
    if (draftRows.length === 0) {
      contactDraftCollection.insert({
        id: 'contact',
        ...CONTACT_DRAFT_EMPTY,
        ...patch,
      })
    } else {
      contactDraftCollection.update('contact', (draft) => {
        Object.assign(draft, patch)
      })
    }
  }

  const form = useForm({
    defaultValues:
      draftRows.length === 0
        ? CONTACT_DRAFT_EMPTY
        : {
            name: existingDraft.name,
            email: existingDraft.email,
            message: existingDraft.message,
          },
    onSubmit: async ({ value }) => {
      setFormError(null)

      try {
        await createContactSubmissionFn({ data: value })
      } catch (error) {
        setFormError(
          error instanceof Error ? error.message : t('contact.genericError'),
        )
        return
      }

      form.reset()
      if (draftRows.length > 0) contactDraftCollection.delete('contact')
      setSubmitted(true)
    },
  })

  return (
    <Card withBorder radius="md" padding="lg">
      {submitted ? (
        <Stack align="center" gap="xs" py="md">
          <IconCircleCheck size={32} color="var(--mantine-color-teal-6)" />
          <Title order={4}>{t('contact.successTitle')}</Title>
          <Text c="dimmed" size="sm" ta="center">
            {t('contact.successDescription')}
          </Text>
          <Button variant="light" mt="sm" onClick={() => setSubmitted(false)}>
            {t('contact.sendAnother')}
          </Button>
        </Stack>
      ) : (
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
              name="name"
              validators={{
                onChange: ({ value }) =>
                  value ? undefined : t('contact.nameRequired'),
              }}
            >
              {(field) => (
                <TextInput
                  label={t('contact.nameLabel')}
                  placeholder={t('contact.namePlaceholder')}
                  autoComplete="name"
                  required
                  value={field.state.value}
                  onChange={(event) => {
                    const value = event.currentTarget.value
                    field.handleChange(value)
                    patchDraft({ name: value })
                  }}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors[0]}
                />
              )}
            </form.Field>

            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return t('contact.emailRequired')
                  if (!EMAIL_PATTERN.test(value)) {
                    return tCommon('messages.invalidEmail')
                  }
                  return undefined
                },
              }}
            >
              {(field) => (
                <TextInput
                  label={t('contact.emailLabel')}
                  placeholder={t('contact.emailPlaceholder')}
                  autoComplete="email"
                  required
                  value={field.state.value}
                  onChange={(event) => {
                    const value = event.currentTarget.value
                    field.handleChange(value)
                    patchDraft({ email: value })
                  }}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors[0]}
                />
              )}
            </form.Field>

            <form.Field
              name="message"
              validators={{
                onChange: ({ value }) =>
                  value ? undefined : t('contact.messageRequired'),
              }}
            >
              {(field) => (
                <Textarea
                  label={t('contact.messageLabel')}
                  placeholder={t('contact.messagePlaceholder')}
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
                    {t('contact.submit')}
                  </Button>
                )}
              </form.Subscribe>
            </Group>
          </Stack>
        </form>
      )}
    </Card>
  )
}
