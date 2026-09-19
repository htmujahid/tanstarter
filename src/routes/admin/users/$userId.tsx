import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import {
  Anchor,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { IconArrowLeft, IconUserOff } from '@tabler/icons-react'
import DetailPageLayout from '#/components/layout/DetailPageLayout'
import SetUserPasswordForm from '#/components/admin/SetUserPasswordForm'
import UserActionsBar from '#/components/admin/UserActionsBar'
import UserDetailsForm from '#/components/admin/UserDetailsForm'
import UserRoleForm from '#/components/admin/UserRoleForm'
import UserSessionsCard from '#/components/admin/UserSessionsCard'
import { userQueryOptions } from '#/lib/queries/admin'

export const Route = createFileRoute('/admin/users/$userId')({
  loader: async ({ context, params }) => {
    try {
      await context.queryClient.query({
        ...userQueryOptions(params.userId),
        staleTime: 'static',
      })
    } catch {
      throw notFound()
    }
  },
  pendingComponent: UserDetailPending,
  notFoundComponent: UserNotFound,
  staticData: { breadcrumb: 'User details' },
  component: UserDetailPage,
})

function BackLink() {
  return (
    <Anchor component={Link} to="/admin/users" size="sm" c="dimmed">
      <Group gap={4} wrap="nowrap">
        <IconArrowLeft size={14} />
        Back to users
      </Group>
    </Anchor>
  )
}

function UserNotFound() {
  return (
    <Container size="lg" px={0}>
      <Stack gap="lg">
        <BackLink />
        <Card withBorder radius="md" padding="xl">
          <Stack align="center" gap="xs" py="md">
            <IconUserOff
              size={32}
              className="text-[var(--mantine-color-dimmed)]"
            />
            <Title order={4}>User not found</Title>
            <Text c="dimmed" size="sm" ta="center">
              This user may have been deleted, or the link is no longer valid.
            </Text>
            <Button component={Link} to="/admin/users" variant="light" mt="sm">
              Back to users
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}

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

function UserDetailPending() {
  return (
    <Container size="lg" px={0}>
      <Stack gap="lg">
        <Group justify="space-between" align="center" wrap="wrap">
          <BackLink />
          <Skeleton height={36} width={260} />
        </Group>

        <Grid gap="lg">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="md">
              <CardSkeleton />
              <CardSkeleton rows={3} />
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              <CardSkeleton rows={1} />
              <CardSkeleton rows={1} />
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  )
}

function UserDetailPage() {
  const { userId } = Route.useParams()
  const { data: user } = useSuspenseQuery(userQueryOptions(userId))
  const { session } = Route.useRouteContext()
  const queryClient = useQueryClient()

  const isSelf = user.id === session.user.id
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['admin'] })

  return (
    <DetailPageLayout
      backLink={<BackLink />}
      actions={
        <UserActionsBar user={user} isSelf={isSelf} onChanged={invalidate} />
      }
      main={
        <>
          <UserDetailsForm user={user} onSaved={invalidate} />
          <UserSessionsCard
            userId={user.id}
            currentSessionToken={session.session.token}
          />
        </>
      }
      sidebar={
        <>
          <UserRoleForm user={user} disabled={isSelf} onSaved={invalidate} />
          <SetUserPasswordForm userId={user.id} />
        </>
      }
    />
  )
}
