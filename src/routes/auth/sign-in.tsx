import { createFileRoute } from '@tanstack/react-router'
import { Stack, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { SignInForm } from '#/components/auth/sign-in-form'

function isSafeRedirect(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.startsWith('/') &&
    !value.startsWith('//')
  )
}

export const Route = createFileRoute('/auth/sign-in')({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: isSafeRedirect(search.redirect) ? search.redirect : undefined,
  }),
  component: SignIn,
})

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
