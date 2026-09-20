import { createFileRoute, redirect } from '@tanstack/react-router'
import { Stack, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { SetupForm } from '#/components/auth/setup-form'
import { getSetupStatusFn } from '#/server/actions/setup'

export const Route = createFileRoute('/auth/setup')({
  beforeLoad: async () => {
    const { needsSetup } = await getSetupStatusFn()
    if (!needsSetup) {
      throw redirect({ to: '/auth/sign-in' })
    }
  },
  component: Setup,
})

function Setup() {
  const { t } = useTranslation('auth')

  return (
    <Stack gap="xl">
      <Stack gap={4}>
        <Title order={2}>{t('setup.title')}</Title>
        <Text c="dimmed" size="sm">
          {t('setup.subtitle')}
        </Text>
      </Stack>

      <SetupForm />
    </Stack>
  )
}
