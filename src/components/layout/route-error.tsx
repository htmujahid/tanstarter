import { Link, useRouter } from '@tanstack/react-router'
import { Button, Card, Code, Container, Group, Stack, Text, Title } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import type { ErrorComponentProps } from '@tanstack/react-router'

/**
 * Shared `errorComponent` for the root route and each section layout
 * (admin/home/site/auth). Section layouts pass this as-is so a loader or
 * render error inside a section still leaves its shell (sidebar/header)
 * intact instead of falling back to the root's full-page boundary.
 */
export function RouteError({ error, reset }: ErrorComponentProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const message = error instanceof Error ? error.message : String(error)

  return (
    <Container size="lg" px={0} py="xl">
      <Card withBorder radius="md" padding="xl">
        <Stack align="center" gap="xs" py="md">
          <IconAlertTriangle
            size={32}
            className="text-[var(--mantine-color-red-6)]"
          />
          <Title order={4}>{t('error.title')}</Title>
          <Text c="dimmed" size="sm" ta="center">
            {t('error.description')}
          </Text>
          {import.meta.env.DEV && message && (
            <Code block w="100%" mt="xs">
              {message}
            </Code>
          )}
          <Group gap="xs" mt="sm">
            <Button
              variant="light"
              onClick={() => {
                reset()
                router.invalidate()
              }}
            >
              {t('actions.retry')}
            </Button>
            <Button component={Link} to="/" variant="subtle">
              {t('nav.home')}
            </Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  )
}
