import { createFileRoute, redirect } from '@tanstack/react-router'
import { Stack, Text, Title } from '@mantine/core'
import SetupForm from '#/components/auth/SetupForm'
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
  return (
    <Stack gap="xl">
      <Stack gap={4}>
        <Title order={2}>Get started</Title>
        <Text c="dimmed" size="sm">
          Create the first account to set up your store
        </Text>
      </Stack>

      <SetupForm />
    </Stack>
  )
}
