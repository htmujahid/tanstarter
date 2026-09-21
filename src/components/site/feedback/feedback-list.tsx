import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Group,
  Stack,
  Text,
} from '@mantine/core'
import { IconMessageCircle, IconPlus } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { formatDateTime } from '#/lib/format-date'
import { feedbackListQueryOptions } from '#/lib/queries/feedback.query'
import type { FeedbackCategory, FeedbackStatus } from '#/server/db'

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

export function FeedbackList({ onAddFeedback }: { onAddFeedback: () => void }) {
  const { t } = useTranslation('site')
  const {
    data: { feedback },
  } = useSuspenseQuery(feedbackListQueryOptions({ page: 1 }))

  if (feedback.length === 0) {
    return (
      <Card withBorder radius="md" padding="xl">
        <EmptyState
          icon={<IconMessageCircle size={28} />}
          withIndicatorBackground
          title={t('feedback.emptyState.title')}
          description={t('feedback.emptyState.description')}
        >
          <EmptyState.Actions>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={onAddFeedback}
            >
              {t('feedback.sendFeedback')}
            </Button>
          </EmptyState.Actions>
        </EmptyState>
      </Card>
    )
  }

  return (
    <Stack gap="md">
      {feedback.map((item) => (
        <Link
          key={item.id}
          to="/site/feedback/$feedbackId"
          params={{ feedbackId: String(item.id) }}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Card
            withBorder
            radius="md"
            padding="lg"
            className="transition-colors hover:bg-[var(--mantine-color-default-hover)]"
          >
            <Stack gap="xs">
              <Group justify="space-between" align="flex-start" wrap="wrap">
                <Group gap="xs">
                  <Badge
                    color={CATEGORY_COLORS[item.category] ?? 'gray'}
                    variant="light"
                    size="sm"
                  >
                    {t(
                      `feedback.categories.${item.category as FeedbackCategory}`,
                    )}
                  </Badge>
                  <Badge
                    color={STATUS_COLORS[item.status] ?? 'gray'}
                    variant="light"
                    size="sm"
                  >
                    {t(`feedback.statuses.${item.status as FeedbackStatus}`)}
                  </Badge>
                </Group>
              </Group>

              <Text size="sm" lineClamp={2}>
                {item.message}
              </Text>

              <Text size="xs" c="dimmed">
                {formatDateTime(item.createdAt)}
              </Text>
            </Stack>
          </Card>
        </Link>
      ))}
    </Stack>
  )
}
