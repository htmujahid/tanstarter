import { Suspense } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  Button,
  Card,
  Container,
  Group,
  Skeleton,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core'
import {
  IconArrowRight,
  IconShieldLock,
  IconUserOff,
  IconUsers,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import type { Icon } from '@tabler/icons-react'
import { adminStatsQueryOptions } from '#/lib/queries/admin.query'

export const Route = createFileRoute('/admin/')({
  loader: ({ context }) => {
    // Fire-and-forget: the overview shell renders immediately and the stat
    // cards stream in via the <Suspense> boundary below instead of blocking
    // navigation on this query.
    void context.queryClient
      .query(adminStatsQueryOptions())
      .catch(() => undefined)
  },
  pendingComponent: AdminOverviewPending,
  component: AdminOverview,
})

function OverviewCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: number
  icon: Icon
  color: string
}) {
  return (
    <Card withBorder radius="md" padding="lg">
      <Group justify="space-between" mb="xs">
        <Text size="sm" c="dimmed" fw={500}>
          {label}
        </Text>
        <ThemeIcon variant="light" color={color} size={32} radius="md">
          <Icon size={18} stroke={1.75} />
        </ThemeIcon>
      </Group>

      <Text fw={700} className="text-2xl">
        {value}
      </Text>
    </Card>
  )
}

function StatsSkeleton() {
  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
      {[0, 1, 2].map((i) => (
        <Card key={i} withBorder radius="md" padding="lg">
          <Group justify="space-between" mb="xs">
            <Skeleton height={14} width={90} />
            <Skeleton height={32} width={32} radius="md" circle />
          </Group>
          <Skeleton height={28} width={60} />
        </Card>
      ))}
    </SimpleGrid>
  )
}

function AdminStats() {
  const { t } = useTranslation('admin')
  const { data: stats } = useSuspenseQuery(adminStatsQueryOptions())

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
      <OverviewCard
        label={t('overview.statTotalUsers')}
        value={stats.total}
        icon={IconUsers}
        color="blue"
      />
      <OverviewCard
        label={t('overview.statAdmins')}
        value={stats.admins}
        icon={IconShieldLock}
        color="grape"
      />
      <OverviewCard
        label={t('overview.statBanned')}
        value={stats.banned}
        icon={IconUserOff}
        color="red"
      />
    </SimpleGrid>
  )
}

function ManageUsersCard() {
  const { t } = useTranslation('admin')

  return (
    <Card withBorder radius="md" padding="lg">
      <Group justify="space-between">
        <div>
          <Text fw={600}>{t('overview.manageUsersTitle')}</Text>
          <Text size="sm" c="dimmed">
            {t('overview.manageUsersDescription')}
          </Text>
        </div>
        <Button
          component={Link}
          to="/admin/users"
          rightSection={<IconArrowRight size={16} className="icon-rtl-flip" />}
        >
          {t('overview.goToUsers')}
        </Button>
      </Group>
    </Card>
  )
}

function AdminOverviewPending() {
  return (
    <Container size="lg" px={0}>
      <Stack gap="md">
        <StatsSkeleton />
        <ManageUsersCard />
      </Stack>
    </Container>
  )
}

function AdminOverview() {
  return (
    <Container size="lg" px={0}>
      <Stack gap="md">
        <Suspense fallback={<StatsSkeleton />}>
          <AdminStats />
        </Suspense>

        <ManageUsersCard />
      </Stack>
    </Container>
  )
}
