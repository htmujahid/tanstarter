import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import {
  Anchor,
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
import { FeedbackDetail } from '#/components/site/feedback/feedback-detail'
import { feedbackQueryOptions } from '#/lib/queries/feedback'

export const Route = createFileRoute('/site/feedback/$feedbackId')({
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

function BackLink() {
  return (
    <Anchor component={Link} to="/site/feedback" size="sm" c="dimmed">
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
              to="/site/feedback"
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

  return (
    <Container size="md" px={0}>
      <Stack gap="lg">
        <BackLink />
        <FeedbackDetail feedbackId={Number(feedbackId)} />
      </Stack>
    </Container>
  )
}
