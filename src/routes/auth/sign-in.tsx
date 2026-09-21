import { createFileRoute } from '@tanstack/react-router'
import { Stack, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { SignInForm } from '#/components/auth/sign-in-form'

export const Route = createFileRoute('/auth/sign-in')({ component: SignIn })

function SignIn() {
  const { t } = useTranslation('auth')

  return (
    <Stack gap="xl">
      <Stack gap={4}>
        <Title order={2}>{t('signIn.title')}</Title>
        <Text c="dimmed" size="sm">
          {t('signIn.subtitle')}
        </Text>
      </Stack>

      <SignInForm />
    </Stack>
  )
}
