import { createFileRoute } from '@tanstack/react-router'
import { Container, Grid, Stack } from '@mantine/core'
import ChangePasswordForm from '#/components/profile/ChangePasswordForm'
import ProfileForm from '#/components/profile/ProfileForm'

export const Route = createFileRoute('/home/profile')({
  staticData: { breadcrumb: 'Profile' },
  component: Profile,
})

function Profile() {
  const { session } = Route.useRouteContext()

  return (
    <Container size="lg" px={0}>
      <Grid gap="lg">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="xl">
            <ProfileForm user={session.user} />
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="xl">
            <ChangePasswordForm />
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  )
}
