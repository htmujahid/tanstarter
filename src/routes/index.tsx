import { createFileRoute } from '@tanstack/react-router'
import { Button, Container, Group, Stack, Title } from '@mantine/core'

import ThemeToggle from '#/components/ThemeToggle'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={1}>Mantine + TanStack Start</Title>
          <ThemeToggle />
        </Group>
        <Group>
          <Button>Primary</Button>
          <Button variant="default">Default</Button>
          <Button variant="outline">Outline</Button>
        </Group>
      </Stack>
    </Container>
  )
}
