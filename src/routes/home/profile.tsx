import { createFileRoute } from '@tanstack/react-router'
import { Stack } from '@mantine/core'
import ChangePasswordForm from '#/components/profile/ChangePasswordForm'
import ProfileForm from '#/components/profile/ProfileForm'

export const Route = createFileRoute('/home/profile')({
  staticData: { breadcrumb: 'Profile' },
  component: Profile,
})

function Profile() {
  const { session } = Route.useRouteContext()

  return (
    <Stack gap="xl" maw={640}>
      <ProfileForm user={session.user} />
      <ChangePasswordForm />
    </Stack>
  )
}
