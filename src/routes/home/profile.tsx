import { createFileRoute } from '@tanstack/react-router'
import { Stack, Text, Title } from '@mantine/core'
import ChangePasswordForm from '#/components/profile/ChangePasswordForm'
import ProfileForm from '#/components/profile/ProfileForm'

export const Route = createFileRoute('/home/profile')({ component: Profile })

function Profile() {
  const { session } = Route.useRouteContext()

  return (
    <Stack gap="xl" maw={640}>
      <Stack gap={4}>
        <Title order={1} className="text-3xl">
          Profile
        </Title>
        <Text c="dimmed" size="sm">
          Manage your account details and password.
        </Text>
      </Stack>

      <ProfileForm user={session.user} />
      <ChangePasswordForm />
    </Stack>
  )
}
