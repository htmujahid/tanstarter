import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import {
  Alert,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  TextInput,
} from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { authClient } from '#/lib/auth-client'

export function CreateApiKeyForm({
  opened,
  onClose,
  onCreated,
}: {
  opened: boolean
  onClose: () => void
  onCreated: (key: string) => void
}) {
  const { t } = useTranslation('home')
  const { t: tCommon } = useTranslation('common')
  const [formError, setFormError] = useState<string | null>(null)

  const EXPIRATION_OPTIONS = [
    { value: 'never', label: t('apiKeys.createForm.expirationNever') },
    {
      value: String(30 * 24 * 60 * 60),
      label: t('apiKeys.createForm.expiration30Days'),
    },
    {
      value: String(90 * 24 * 60 * 60),
      label: t('apiKeys.createForm.expiration90Days'),
    },
    {
      value: String(365 * 24 * 60 * 60),
      label: t('apiKeys.createForm.expiration1Year'),
    },
  ]

  const form = useForm({
    defaultValues: { name: '', expiration: 'never' },
    onSubmit: async ({ value }) => {
      setFormError(null)

      const { data, error } = await authClient.apiKey.create({
        name: value.name,
        expiresIn:
          value.expiration === 'never' ? null : Number(value.expiration),
      })

      if (error) {
        setFormError(error.message ?? t('apiKeys.createForm.genericError'))
        return
      }

      form.reset()
      onCreated(data.key)
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
      title={t('apiKeys.createForm.title')}
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
            name="name"
            validators={{
              onChange: ({ value }) =>
                value ? undefined : t('apiKeys.createForm.nameRequired'),
            }}
          >
            {(field) => (
              <TextInput
                label={t('apiKeys.createForm.nameLabel')}
                placeholder={t('apiKeys.createForm.namePlaceholder')}
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

          <form.Field name="expiration">
            {(field) => (
              <Select
                label={t('apiKeys.createForm.expirationLabel')}
                data={EXPIRATION_OPTIONS}
                value={field.state.value}
                onChange={(value) => field.handleChange(value ?? 'never')}
                allowDeselect={false}
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
                  {t('apiKeys.createForm.submit')}
                </Button>
              )}
            </form.Subscribe>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
