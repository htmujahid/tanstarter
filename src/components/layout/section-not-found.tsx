import { Link } from '@tanstack/react-router'
import type { LinkProps } from '@tanstack/react-router'
import { Button, Card, Container, Stack, Text, Title } from '@mantine/core'
import { IconError404 } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

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
