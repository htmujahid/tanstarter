import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Container, Group, Stack, Text, Title } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { CreateFeedbackForm } from '#/components/site/feedback/create-feedback-form'
import { FeedbackList } from '#/components/site/feedback/feedback-list'
import { feedbackListQueryOptions } from '#/lib/queries/feedback'

export const Route = createFileRoute('/site/feedback/')({
  loader: ({ context }) =>
    context.queryClient.query({
      ...feedbackListQueryOptions({ page: 1 }),
      staleTime: 'static',
    }),
  staticData: { breadcrumb: 'Feedback' },
  component: FeedbackPage,
})

function FeedbackPage() {
  const queryClient = useQueryClient()
  const [createOpened, setCreateOpened] = useState(false)

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['feedback'] })

  return (
    <Container size="md" px={0}>
      <Stack gap="xl">
        <Group justify="space-between" align="flex-start" wrap="wrap">
          <Stack gap={4}>
            <Title order={1} className="text-3xl">
              Feedback
            </Title>
            <Text c="dimmed" size="sm">
              Your past submissions, and a place to send a new one.
            </Text>
          </Stack>

          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setCreateOpened(true)}
          >
            Send feedback
          </Button>
        </Group>

        <FeedbackList onAddFeedback={() => setCreateOpened(true)} />

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
