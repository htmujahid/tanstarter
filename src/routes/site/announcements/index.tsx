import { Link, createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Card, Container, EmptyState, Stack, Text, Title } from '@mantine/core'
import { IconBellRinging } from '@tabler/icons-react'
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

function formatTimestamp(value: string) {
  return new Date(value.replace(' ', 'T') + 'Z').toLocaleString()
}

function AnnouncementsPage() {
  const {
    data: { announcements },
  } = useSuspenseQuery(siteAnnouncementsQueryOptions({ page: 1 }))

  return (
    <Container size="md" px={0}>
      <Stack gap="xl">
        <Stack gap={4}>
          <Title order={1} className="text-3xl">
            Announcements
          </Title>
          <Text c="dimmed" size="sm">
            Product updates and news, open to everyone.
          </Text>
        </Stack>

        <Stack gap="md">
          {announcements.length === 0 ? (
            <Card withBorder radius="md" padding="xl">
              <EmptyState
                icon={<IconBellRinging size={28} />}
                withIndicatorBackground
                title="No announcements yet"
                description="Check back later for updates."
              />
            </Card>
          ) : (
            announcements.map((announcement) => (
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
                      {formatTimestamp(announcement.createdAt)}
                    </Text>
                  </Stack>
                </Card>
              </Link>
            ))
          )}
        </Stack>
      </Stack>
    </Container>
  )
}
