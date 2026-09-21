import { Link, useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import {
  Button,
  Card,
  Code,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useNetwork } from '@mantine/hooks'
import { IconAlertTriangle, IconWifiOff } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export function RouteError({ error, reset }: ErrorComponentProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { online } = useNetwork()
  const message = error instanceof Error ? error.message : String(error)

  if (!online) {
    return (
      <Container size="lg" px={0} py="xl">
        <Card withBorder radius="md" padding="xl">
          <Stack align="center" gap="xs" py="md">
            <IconWifiOff
              size={32}
              className="text-[var(--mantine-color-dimmed)]"
            />
            <Title order={4}>{t('offline.title')}</Title>
            <Text c="dimmed" size="sm" ta="center">
              {t('offline.description')}
            </Text>
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
