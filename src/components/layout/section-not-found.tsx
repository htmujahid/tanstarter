import { Link } from '@tanstack/react-router'
import { Button, Card, Container, Stack, Text, Title } from '@mantine/core'
import { IconError404 } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import type { LinkProps } from '@tanstack/react-router'

/**
 * Shared `notFoundComponent` for each section layout (admin/home/site). A
 * bare `notFound()` bubbles to the nearest ancestor route that defines one;
 * without this, an unmatched URL under e.g. /admin/* would fall through to
 * the root's full-page NotFound and drop the sidebar/header chrome.
 */
export function SectionNotFound({
  backTo,
  backLabel,
}: {
  backTo: LinkProps['to']
  backLabel: string
}) {
  const { t } = useTranslation()

  return (
    <Container size="lg" px={0} py="xl">
      <Card withBorder radius="md" padding="xl">
        <Stack align="center" gap="xs" py="md">
          <IconError404
            size={32}
            className="text-[var(--mantine-color-dimmed)]"
          />
          <Title order={4}>{t('notFound.title')}</Title>
          <Text c="dimmed" size="sm" ta="center">
            {t('notFound.description')}
          </Text>
          <Button component={Link} to={backTo} variant="light" mt="sm">
            {backLabel}
          </Button>
        </Stack>
      </Card>
    </Container>
  )
}
