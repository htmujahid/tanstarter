import type { ReactNode } from 'react'
import { Container, Group, Stack, Text, Title } from '@mantine/core'

export function DetailPageLayout({
  backLink,
  title,
  description,
  badges,
  actions,
  children,
}: {
  backLink?: ReactNode
  title?: ReactNode
  description?: ReactNode
  badges?: ReactNode
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <Container size="lg" px={0}>
      <Stack gap="lg">
        <Group justify="space-between" align="center" gap="md" wrap="wrap">
          {backLink}
          {actions}
        </Group>

        {title && (
          <Stack gap={4}>
            <Group gap="xs" align="center">
              <Title order={2}>{title}</Title>
              {badges}
            </Group>
            {description && (
              <Text c="dimmed" size="sm">
                {description}
              </Text>
            )}
          </Stack>
        )}

        {children}
      </Stack>
    </Container>
  )
}
