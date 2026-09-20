import { Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Card, EmptyState, Stack, Text, Title } from '@mantine/core'
import { IconBellRinging } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { formatDateTime } from '#/lib/format-date'
import { siteAnnouncementsQueryOptions } from '#/lib/queries/announcements'

export function AnnouncementsList() {
  const { t } = useTranslation('site')
  const {
    data: { announcements },
  } = useSuspenseQuery(siteAnnouncementsQueryOptions({ page: 1 }))

  if (announcements.length === 0) {
    return (
      <Card withBorder radius="md" padding="xl">
        <EmptyState
          icon={<IconBellRinging size={28} />}
          withIndicatorBackground
          title={t('announcements.emptyState.title')}
          description={t('announcements.emptyState.description')}
        />
      </Card>
    )
  }

  return (
    <Stack gap="md">
      {announcements.map((announcement) => (
        <Link
          key={announcement.id}
          to="/site/announcements/$announcementId"
          params={{ announcementId: String(announcement.id) }}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Card
            withBorder
            radius="md"
            padding="lg"
            className="transition-colors hover:bg-[var(--mantine-color-default-hover)]"
          >
            <Stack gap="xs">
              <Title order={4}>{announcement.title}</Title>

              {announcement.body && (
                <Text size="sm" c="dimmed" lineClamp={2}>
                  {announcement.body}
                </Text>
              )}

              <Text size="xs" c="dimmed">
                {formatDateTime(announcement.createdAt)}
              </Text>
            </Stack>
          </Card>
        </Link>
      ))}
    </Stack>
  )
}
