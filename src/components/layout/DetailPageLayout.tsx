import { Container, Grid, Group, Stack, Text, Title } from '@mantine/core'
import type { ReactNode } from 'react'

/**
 * Shared shell for "detail" pages (a single record's view/edit screen):
 * back link + page-level actions on one row, title/description/badges below,
 * and a two-column body. Keep page-specific content in `main`/`sidebar` so
 * new detail pages (products, orders, ...) stay visually consistent.
 */
export default function DetailPageLayout({
  backLink,
  title,
  description,
  badges,
  actions,
  main,
  sidebar,
}: {
  backLink?: ReactNode
  title?: ReactNode
  description?: ReactNode
  badges?: ReactNode
  actions?: ReactNode
  main: ReactNode
  sidebar?: ReactNode
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

        <Grid gap="md">
          <Grid.Col span={{ base: 12, md: sidebar ? 8 : 12 }}>
            <Stack gap="md">{main}</Stack>
          </Grid.Col>
          {sidebar && (
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="md">{sidebar}</Stack>
            </Grid.Col>
          )}
        </Grid>
      </Stack>
    </Container>
  )
}
