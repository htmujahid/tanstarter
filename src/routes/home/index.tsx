import { createFileRoute } from '@tanstack/react-router'
import {
  Badge,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { IconPackage, IconReceipt2, IconUsers } from '@tabler/icons-react'

export const Route = createFileRoute('/home/')({ component: Home })

const sections = [
  {
    icon: IconPackage,
    title: 'Products',
    description: 'Add and manage everything you sell.',
  },
  {
    icon: IconReceipt2,
    title: 'Orders',
    description: 'Track and fulfill customer orders.',
  },
  {
    icon: IconUsers,
    title: 'Customers',
    description: 'See who is buying from your store.',
  },
]

function Home() {
  const { session } = Route.useRouteContext()

  return (
    <main className="flex-1 px-6 py-10">
      <Stack gap="xl" maw={900} mx="auto">
        <Stack gap={4}>
          <Title order={1} className="text-3xl">
            Welcome back, {session.user.name}
          </Title>
          <Text c="dimmed" size="sm">
            This is your dashboard home. More tools for managing your store are
            on the way.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          {sections.map((section) => (
            <Card key={section.title} withBorder radius="md" padding="lg">
              <Group justify="space-between" mb="sm">
                <ThemeIcon variant="light" color="blue" size={36} radius="md">
                  <section.icon size={18} stroke={1.75} />
                </ThemeIcon>
                <Badge variant="light" color="gray" size="sm">
                  Coming soon
                </Badge>
              </Group>
              <Text fw={600} size="sm">
                {section.title}
              </Text>
              <Text size="xs" c="dimmed">
                {section.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </main>
  )
}
