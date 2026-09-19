import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import {
  Anchor,
  Button,
  Card,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { IconArrowLeft, IconUserOff } from '@tabler/icons-react'
import SetUserPasswordForm from '#/components/admin/SetUserPasswordForm'
import UserDetailsForm from '#/components/admin/UserDetailsForm'
import UserRoleForm from '#/components/admin/UserRoleForm'
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
    <Stack gap="md" maw={640}>
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
  )
}

function UserDetailPending() {
  return (
    <Stack gap="md" maw={640}>
      <BackLink />
      {[0, 1, 2].map((i) => (
        <Card key={i} withBorder radius="md" padding="lg">
          <Stack gap="md">
            <Skeleton height={16} width={140} />
            <Skeleton height={36} />
            <Skeleton height={36} />
          </Stack>
        </Card>
      ))}
    </Stack>
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
    <Stack gap="md" maw={640}>
      <BackLink />

      <UserDetailsForm user={user} onSaved={invalidate} />
      <UserRoleForm user={user} disabled={isSelf} onSaved={invalidate} />
      <SetUserPasswordForm userId={user.id} />
    </Stack>
  )
}
