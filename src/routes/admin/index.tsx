import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Button,
  Card,
  Group,
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
import type { Icon } from '@tabler/icons-react'
import { getAdminStatsFn } from '#/server/actions/admin'

export const Route = createFileRoute('/admin/')({
  loader: () => getAdminStatsFn(),
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

function AdminOverview() {
  const stats = Route.useLoaderData()

  return (
    <Stack gap="md">
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <OverviewCard
          label="Total users"
          value={stats.total}
          icon={IconUsers}
          color="blue"
        />
        <OverviewCard
          label="Admins"
          value={stats.admins}
          icon={IconShieldLock}
          color="grape"
        />
        <OverviewCard
          label="Banned"
          value={stats.banned}
          icon={IconUserOff}
          color="red"
        />
      </SimpleGrid>

      <Card withBorder radius="md" padding="lg">
        <Group justify="space-between">
          <div>
            <Text fw={600}>Manage users</Text>
            <Text size="sm" c="dimmed">
              Create accounts, change roles, and ban or remove users.
            </Text>
          </div>
          <Button
            component={Link}
            to="/admin/users"
            rightSection={<IconArrowRight size={16} />}
          >
            Go to users
          </Button>
        </Group>
      </Card>
    </Stack>
  )
}
