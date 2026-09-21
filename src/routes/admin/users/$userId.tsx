import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
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
import { useTranslation } from 'react-i18next'

import { SetUserPasswordForm } from '#/components/admin/users/set-user-password-form'
import { UserDetailActions } from '#/components/admin/users/user-detail-actions'
import { UserDetailsForm } from '#/components/admin/users/user-details-form'
import { UserRoleForm } from '#/components/admin/users/user-role-form'
import { UserSessionsCard } from '#/components/admin/users/user-sessions-card'
import { DetailPageLayout } from '#/components/layout/detail-page-layout'
import {
  userQueryOptions,
  userSessionsQueryOptions,
} from '#/lib/queries/admin.query'

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

    await context.queryClient.query({
      ...userSessionsQueryOptions(params.userId),
      staleTime: 'static',
    })
  },
  pendingComponent: UserDetailPending,
  notFoundComponent: UserNotFound,
  staticData: { breadcrumb: 'User details' },
  component: UserDetailPage,
})

function BackLink() {
  const { t } = useTranslation('admin')
  return (
    <Anchor component={Link} to="/admin/users" size="sm" c="dimmed">
      <Group gap={4} wrap="nowrap">
        <IconArrowLeft size={14} className="icon-rtl-flip" />
        {t('users.detail.backLink')}
      </Group>
    </Anchor>
  )
}

function UserNotFound() {
  const { t } = useTranslation('admin')
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
            <Title order={4}>{t('users.detail.notFound.title')}</Title>
            <Text c="dimmed" size="sm" ta="center">
              {t('users.detail.notFound.description')}
            </Text>
            <Button component={Link} to="/admin/users" variant="light" mt="sm">
              {t('users.detail.backLink')}
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

        <Grid gap="md">
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
  const { session } = Route.useRouteContext()
  const queryClient = useQueryClient()

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['admin'] })

  return (
    <DetailPageLayout
      backLink={<BackLink />}
      actions={<UserDetailActions userId={userId} onChanged={invalidate} />}
    >
      <Grid gap="md">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            <UserDetailsForm userId={userId} onSaved={invalidate} />
            <UserSessionsCard
              userId={userId}
              currentSessionToken={session.session.token}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md">
            <UserRoleForm userId={userId} onSaved={invalidate} />
            <SetUserPasswordForm userId={userId} />
          </Stack>
        </Grid.Col>
      </Grid>
    </DetailPageLayout>
  )
}
