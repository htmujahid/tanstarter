import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import {
  Badge,
  Button,
  Card,
  Container,
  EmptyState,
  Group,
  Stack,
  Text,
} from '@mantine/core'
import { IconMessageCircle, IconPlus } from '@tabler/icons-react'
import { CreateFeedbackForm } from '#/components/home/feedback/create-feedback-form'
import { feedbackListQueryOptions } from '#/lib/queries/feedback'

export const Route = createFileRoute('/home/feedback/')({
  loader: ({ context }) =>
    context.queryClient.query({
      ...feedbackListQueryOptions({ page: 1 }),
      staleTime: 'static',
    }),
  staticData: { breadcrumb: 'Feedback' },
  component: FeedbackPage,
})

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

function formatTimestamp(value: string) {
  return new Date(value.replace(' ', 'T') + 'Z').toLocaleString()
}

function FeedbackPage() {
  const queryClient = useQueryClient()
  const [createOpened, setCreateOpened] = useState(false)

  const {
    data: { feedback },
  } = useSuspenseQuery(feedbackListQueryOptions({ page: 1 }))

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['feedback'] })

  return (
    <Container size="md" px={0}>
      <Stack gap="md">
        <Group justify="flex-end">
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setCreateOpened(true)}
          >
            Send feedback
          </Button>
        </Group>

        {feedback.length === 0 ? (
          <Card withBorder radius="md" padding="xl">
            <EmptyState
              icon={<IconMessageCircle size={28} />}
              withIndicatorBackground
              title="No feedback sent yet"
              description="Have a bug report, feature request, or comment? Let us know."
            >
              <EmptyState.Actions>
                <Button
                  leftSection={<IconPlus size={16} />}
                  onClick={() => setCreateOpened(true)}
                >
                  Send feedback
                </Button>
              </EmptyState.Actions>
            </EmptyState>
          </Card>
        ) : (
          feedback.map((item) => (
            <Link
              key={item.id}
              to="/home/feedback/$feedbackId"
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
                        {item.category}
                      </Badge>
                      <Badge
                        color={STATUS_COLORS[item.status] ?? 'gray'}
                        variant="light"
                        size="sm"
                      >
                        {item.status}
                      </Badge>
                    </Group>
                  </Group>

                  <Text size="sm" lineClamp={2}>
                    {item.message}
                  </Text>

                  <Text size="xs" c="dimmed">
                    {formatTimestamp(item.createdAt)}
                  </Text>
                </Stack>
              </Card>
            </Link>
          ))
        )}

        <CreateFeedbackForm
          opened={createOpened}
          onClose={() => setCreateOpened(false)}
          onCreated={() => {
            setCreateOpened(false)
            void invalidate()
          }}
        />
      </Stack>
    </Container>
  )
}
