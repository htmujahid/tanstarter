import { useSuspenseQuery } from '@tanstack/react-query'
import { Badge, Card, Group, Stack, Text } from '@mantine/core'
import { formatDateTime } from '#/lib/format-date'
import { feedbackQueryOptions } from '#/lib/queries/feedback'

const CATEGORY_COLORS: Record<string, string> = {
  bug: 'red',
  feature: 'blue',
  general: 'gray',
}

const STATUS_COLORS: Record<string, string> = {
  new: 'blue',
  reviewed: 'yellow',
  resolved: 'teal',
}

export function FeedbackDetail({ feedbackId }: { feedbackId: number }) {
  const { data: feedback } = useSuspenseQuery(feedbackQueryOptions(feedbackId))

  return (
    <Card withBorder radius="md" padding="lg">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start" wrap="wrap">
          <Group gap="xs">
            <Badge
              color={CATEGORY_COLORS[feedback.category] ?? 'gray'}
              variant="light"
            >
              {feedback.category}
            </Badge>
            <Badge
              color={STATUS_COLORS[feedback.status] ?? 'gray'}
              variant="light"
            >
              {feedback.status}
            </Badge>
          </Group>
        </Group>

        <Text c="dimmed" size="sm">
          Submitted {formatDateTime(feedback.createdAt)}
        </Text>

        <Text style={{ whiteSpace: 'pre-wrap' }}>{feedback.message}</Text>
      </Stack>
    </Card>
  )
}
