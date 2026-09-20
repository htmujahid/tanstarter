import { createFileRoute } from '@tanstack/react-router'
import { Container, Stack, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { AnnouncementsList } from '#/components/site/announcements/announcements-list'
import { siteAnnouncementsQueryOptions } from '#/lib/queries/announcements'

export const Route = createFileRoute('/site/announcements/')({
  loader: ({ context }) =>
    context.queryClient.query({
      ...siteAnnouncementsQueryOptions({ page: 1 }),
      staleTime: 'static',
    }),
  staticData: { breadcrumb: 'Announcements' },
  component: AnnouncementsPage,
})

function AnnouncementsPage() {
  const { t } = useTranslation('site')

  return (
    <Container size="md" px={0}>
      <Stack gap="xl">
        <Stack gap={4}>
          <Title order={1} className="text-3xl">
            {t('announcements.title')}
          </Title>
          <Text c="dimmed" size="sm">
            {t('announcements.subtitle')}
          </Text>
        </Stack>

        <AnnouncementsList />
      </Stack>
    </Container>
  )
}
