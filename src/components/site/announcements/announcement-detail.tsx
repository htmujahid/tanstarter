import { useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core'
import { IconPencil } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useSession } from '#/hooks/use-session'
import { formatDateTime } from '#/lib/format-date'
import { siteAnnouncementQueryOptions } from '#/lib/queries/announcements.query'

export function AnnouncementDetail({
  announcementId,
}: {
  announcementId: number
}) {
  const { data: announcement } = useSuspenseQuery(
    siteAnnouncementQueryOptions(announcementId),
  )
  const { t: tCommon } = useTranslation('common')
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
            {tCommon('actions.edit')}
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
