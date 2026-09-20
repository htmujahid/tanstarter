import { useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core'
import { IconPencil } from '@tabler/icons-react'
import { useSession } from '#/hooks/use-session'
import { formatDateTime } from '#/lib/format-date'
import { siteAnnouncementQueryOptions } from '#/lib/queries/announcements'

export function AnnouncementDetail({
  announcementId,
}: {
  announcementId: number
}) {
  const { data: announcement } = useSuspenseQuery(
    siteAnnouncementQueryOptions(announcementId),
  )
  const session = useSession()
  const navigate = useNavigate()

  return (
    <Stack gap="lg">
      {session?.user.role === 'admin' && (
        <Group justify="flex-end">
          <Button
            variant="light"
            size="xs"
            leftSection={<IconPencil size={14} />}
            onClick={() =>
              navigate({
                to: '/admin/announcements/$announcementId',
                params: { announcementId: String(announcement.id) },
              })
            }
          >
            Edit
          </Button>
        </Group>
      )}

      <Card withBorder radius="md" padding="lg">
        <Stack gap="md">
          <Title order={2}>{announcement.title}</Title>

          <Text c="dimmed" size="sm">
            {formatDateTime(announcement.createdAt)}
          </Text>

          {announcement.body && (
            <Text style={{ whiteSpace: 'pre-wrap' }}>{announcement.body}</Text>
          )}
        </Stack>
      </Card>
    </Stack>
  )
}
