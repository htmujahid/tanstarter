import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  Anchor,
  Badge,
  Button,
  Card,
  Container,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { IconArrowLeft, IconMessageOff } from '@tabler/icons-react'
import { feedbackQueryOptions } from '#/lib/queries/feedback'

export const Route = createFileRoute('/home/feedback/$feedbackId')({
  loader: async ({ context, params }) => {
    const id = Number(params.feedbackId)
    if (!Number.isInteger(id)) {
      throw notFound()
    }

    try {
      await context.queryClient.query({
        ...feedbackQueryOptions(id),
        staleTime: 'static',
      })
    } catch {
      throw notFound()
    }
  },
  pendingComponent: FeedbackDetailPending,
  notFoundComponent: FeedbackNotFound,
  staticData: { breadcrumb: 'Feedback' },
  component: FeedbackDetailPage,
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

function BackLink() {
  return (
    <Anchor component={Link} to="/home/feedback" size="sm" c="dimmed">
      <Group gap={4} wrap="nowrap">
        <IconArrowLeft size={14} />
        Back to feedback
      </Group>
    </Anchor>
  )
}

function FeedbackNotFound() {
  return (
    <Container size="md" px={0}>
      <Stack gap="lg">
        <BackLink />
        <Card withBorder radius="md" padding="xl">
          <Stack align="center" gap="xs" py="md">
            <IconMessageOff
              size={32}
              className="text-[var(--mantine-color-dimmed)]"
            />
            <Title order={4}>Feedback not found</Title>
            <Text c="dimmed" size="sm" ta="center">
              This feedback may have been removed, or the link is no longer
              valid.
            </Text>
            <Button
              component={Link}
              to="/home/feedback"
              variant="light"
              mt="sm"
            >
              Back to feedback
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}

function FeedbackDetailPending() {
  return (
    <Container size="md" px={0}>
      <Stack gap="lg">
        <BackLink />
        <Card withBorder radius="md" padding="lg">
          <Stack gap="md">
            <Skeleton height={20} width={140} />
            <Skeleton height={14} width={120} />
            <Skeleton height={80} />
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}

function FeedbackDetailPage() {
  const { feedbackId } = Route.useParams()
  const { data: feedback } = useSuspenseQuery(
    feedbackQueryOptions(Number(feedbackId)),
  )

  return (
    <Container size="md" px={0}>
      <Stack gap="lg">
        <BackLink />

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
              Submitted{' '}
              {new Date(
                feedback.createdAt.replace(' ', 'T') + 'Z',
              ).toLocaleString()}
            </Text>

            <Text style={{ whiteSpace: 'pre-wrap' }}>{feedback.message}</Text>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}
