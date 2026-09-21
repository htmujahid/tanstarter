import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import {
  Alert,
  Button,
  Group,
  Modal,
  PasswordInput,
  Select,
  Stack,
  TextInput,
} from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { authClient } from '#/lib/auth-client'

export function CreateUserForm({
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
    defaultValues: { name: '', email: '', password: '', role: 'user' },
    onSubmit: async ({ value }) => {
      setFormError(null)

      const { error } = await authClient.admin.createUser({
        name: value.name,
        email: value.email,
        password: value.password,
        role: value.role as 'admin' | 'user',
      })

      if (error) {
        setFormError(error.message ?? t('users.createForm.genericError'))
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
      title={t('users.createForm.title')}
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
                value ? undefined : t('users.createForm.nameRequired'),
            }}
          >
            {(field) => (
              <TextInput
                label={t('users.createForm.nameLabel')}
                placeholder={t('users.createForm.namePlaceholder')}
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

          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) =>
                value ? undefined : t('users.createForm.emailRequired'),
            }}
          >
            {(field) => (
              <TextInput
                label={t('users.createForm.emailLabel')}
                placeholder={t('users.createForm.emailPlaceholder')}
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

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                value.length >= 8
                  ? undefined
                  : t('users.createForm.passwordTooShort'),
            }}
          >
            {(field) => (
              <PasswordInput
                label={t('users.createForm.passwordLabel')}
                placeholder={t('users.createForm.passwordPlaceholder')}
                autoComplete="new-password"
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

          <form.Field name="role">
            {(field) => (
              <Select
                label={t('users.createForm.roleLabel')}
                data={[
                  { value: 'user', label: t('users.roles.user') },
                  { value: 'admin', label: t('users.roles.admin') },
                ]}
                value={field.state.value}
                onChange={(value) => field.handleChange(value ?? 'user')}
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
                  {t('users.createForm.submitButton')}
                </Button>
              )}
            </form.Subscribe>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
