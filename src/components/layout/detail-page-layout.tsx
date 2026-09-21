import { Container, Group, Stack, Text, Title } from '@mantine/core'
import type { ReactNode } from 'react'

/**
 * Shared shell for "detail" pages (a single record's view/edit screen):
 * back link + page-level actions on one row, title/description/badges below,
 * then `children` rendered as-is. Body layout (single column, two-column
 * with a sidebar, etc.) is the page's own concern — compose it in `children`
 * (e.g. a `Grid`/`Grid.Col` pair) so this shell stays generic.
 */
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
