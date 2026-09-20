import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Badge,
  Button,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { IconArrowRight, IconSparkles } from '@tabler/icons-react'

import { Header } from '#/components/header'
import { features } from '#/lib/features'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Header />

      <main className="relative flex flex-1 items-center justify-center overflow-x-hidden overflow-y-auto px-6 py-6">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div className="bg-grid-pattern absolute inset-0" />
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
          <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl" />
        </div>

        <Stack gap="lg" align="center" maw={760} className="relative">
          <Badge
            size="lg"
            radius="sm"
            variant="light"
            color="blue"
            leftSection={<IconSparkles size={14} />}
          >
            Built for modern storefronts
          </Badge>

          <Stack gap="sm" align="center" ta="center">
            <Title
              order={1}
              className="text-3xl leading-tight sm:text-4xl lg:text-5xl"
            >
              Sell online without{' '}
              <Text
                span
                inherit
                className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
              >
                the overhead
              </Text>
            </Title>
            <Text size="lg" c="dimmed" maw={560}>
              Launch a fast, secure storefront your customers will love. Built
              to get out of your way, so you can focus on selling.
            </Text>
          </Stack>

          <Group gap="sm">
            <Button
              component={Link}
              to="/auth/setup"
              size="md"
              rightSection={<IconArrowRight size={18} />}
            >
              Get started
            </Button>
            <Button component={Link} to="/help" size="md" variant="default">
              Get help
            </Button>
          </Group>

          <Group gap="lg" justify="center" wrap="wrap" className="pt-2">
            {features.map((feature) => (
              <Group
                key={feature.title}
                gap="sm"
                wrap="nowrap"
                align="flex-start"
                w={220}
              >
                <ThemeIcon variant="light" color="blue" size={36} radius="md">
                  <feature.icon size={18} stroke={1.75} />
                </ThemeIcon>
                <Stack gap={2}>
                  <Text fw={600} size="sm">
                    {feature.title}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {feature.description}
                  </Text>
                </Stack>
              </Group>
            ))}
          </Group>
        </Stack>
      </main>
    </div>
  )
}
