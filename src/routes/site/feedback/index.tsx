import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Container, Group, Stack, Text, Title } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { CreateFeedbackForm } from '#/components/site/feedback/create-feedback-form'
import { FeedbackList } from '#/components/site/feedback/feedback-list'
import { feedbackListQueryOptions } from '#/lib/queries/feedback.query'

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
  const { t } = useTranslation('site')
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
              {t('feedback.title')}
            </Title>
            <Text c="dimmed" size="sm">
              {t('feedback.subtitle')}
            </Text>
          </Stack>

          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setCreateOpened(true)}
          >
            {t('feedback.sendFeedback')}
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
