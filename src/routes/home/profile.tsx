import { createFileRoute } from '@tanstack/react-router'
import { Card, Container, Grid, Skeleton, Stack } from '@mantine/core'
import { ChangePasswordForm } from '#/components/profile/change-password-form'
import { PasskeysList } from '#/components/profile/passkeys-list'
import { ProfileForm } from '#/components/profile/profile-form'
import { SessionsList } from '#/components/profile/sessions-list'
import { passkeysQueryOptions } from '#/lib/queries/passkey.query'
import { sessionsQueryOptions } from '#/lib/queries/session.query'

export const Route = createFileRoute('/home/profile')({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.query({
        ...sessionsQueryOptions(),
        staleTime: 'static',
      }),
      context.queryClient.query({
        ...passkeysQueryOptions(),
        staleTime: 'static',
      }),
    ])
  },
  pendingComponent: ProfilePending,
  staticData: { breadcrumb: 'Profile' },
  component: Profile,
})

function CardSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <Card withBorder radius="md" padding="lg">
      <Stack gap="md">
        <Skeleton height={16} width={140} />
        {Array.from({ length: rows }, (_, i) => (
          <Skeleton key={i} height={36} />
        ))}
      </Stack>
    </Card>
  )
}

function ProfilePending() {
  return (
    <Container size="lg" px={0}>
      <Grid gap="md">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="md">
            <CardSkeleton rows={2} />
            <CardSkeleton rows={2} />
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="md">
            <CardSkeleton rows={3} />
            <CardSkeleton rows={2} />
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  )
}

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
