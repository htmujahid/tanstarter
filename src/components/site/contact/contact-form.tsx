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
import { useTranslation } from 'react-i18next'
import { createContactSubmissionFn } from '#/server/actions/contact'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ContactForm() {
  const { t } = useTranslation('site')
  const { t: tCommon } = useTranslation('common')
  const [formError, setFormError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const form = useForm({
    defaultValues: { name: '', email: '', message: '' },
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
                  onChange={(event) =>
                    field.handleChange(event.currentTarget.value)
                  }
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
                  onChange={(event) =>
                    field.handleChange(event.currentTarget.value)
                  }
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
                  onChange={(event) =>
                    field.handleChange(event.currentTarget.value)
                  }
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
