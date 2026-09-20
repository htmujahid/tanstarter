import { createFileRoute } from '@tanstack/react-router'
import { Container, Grid, Stack } from '@mantine/core'
import { ChangePasswordForm } from '#/components/profile/change-password-form'
import { PasskeysList } from '#/components/profile/passkeys-list'
import { ProfileForm } from '#/components/profile/profile-form'
import { SessionsList } from '#/components/profile/sessions-list'
import { passkeysQueryOptions } from '#/lib/queries/passkey'
import { sessionsQueryOptions } from '#/lib/queries/session'

export const Route = createFileRoute('/home/profile')({
  loader: ({ context }) => {
    void context.queryClient
      .query({ ...sessionsQueryOptions(), staleTime: 'static' })
      .catch(() => undefined)
    void context.queryClient
      .query({ ...passkeysQueryOptions(), staleTime: 'static' })
      .catch(() => undefined)
  },
  staticData: { breadcrumb: 'Profile' },
  component: Profile,
})

function Profile() {
  const { session } = Route.useRouteContext()

  return (
    <Container size="lg" px={0}>
      <Grid gap="md">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="md">
            <ProfileForm user={session.user} />
            <SessionsList currentSessionToken={session.session.token} />
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="md">
            <ChangePasswordForm />
            <PasskeysList />
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  )
}
