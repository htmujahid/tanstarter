import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { Anchor, Group, Stack } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import SetUserPasswordForm from '#/components/admin/SetUserPasswordForm'
import UserDetailsForm from '#/components/admin/UserDetailsForm'
import UserRoleForm from '#/components/admin/UserRoleForm'
import { getUserFn } from '#/server/actions/admin'

export const Route = createFileRoute('/admin/users/$userId')({
  loader: ({ params }) => getUserFn({ data: { id: params.userId } }),
  staticData: { breadcrumb: 'User details' },
  component: UserDetailPage,
})

function UserDetailPage() {
  const user = Route.useLoaderData()
  const { session } = Route.useRouteContext()
  const router = useRouter()

  const isSelf = user.id === session.user.id

  return (
    <Stack gap="md" maw={640}>
      <Anchor component={Link} to="/admin/users" size="sm" c="dimmed">
        <Group gap={4} wrap="nowrap">
          <IconArrowLeft size={14} />
          Back to users
        </Group>
      </Anchor>

      <UserDetailsForm user={user} onSaved={() => router.invalidate()} />
      <UserRoleForm
        user={user}
        disabled={isSelf}
        onSaved={() => router.invalidate()}
      />
      <SetUserPasswordForm userId={user.id} />
    </Stack>
  )
}
