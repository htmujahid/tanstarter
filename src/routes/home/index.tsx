import { createFileRoute } from '@tanstack/react-router'
import {
  Badge,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
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
  return (
    <Stack gap="xl" maw={900}>
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
  )
}
