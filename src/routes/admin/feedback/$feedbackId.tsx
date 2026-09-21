import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import {
  Anchor,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { IconArrowLeft, IconMessageOff } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { DetailPageLayout } from '#/components/layout/detail-page-layout'
import { FeedbackDetailActions } from '#/components/admin/feedback/feedback-detail-actions'
import { FeedbackDetailForm } from '#/components/admin/feedback/feedback-detail-form'
import { feedbackQueryOptions } from '#/lib/queries/feedback'

export const Route = createFileRoute('/admin/feedback/$feedbackId')({
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
  staticData: { breadcrumb: 'Feedback details' },
  component: FeedbackDetailPage,
})

function BackLink() {
  const { t } = useTranslation('admin')

  return (
    <Anchor component={Link} to="/admin/feedback" size="sm" c="dimmed">
      <Group gap={4} wrap="nowrap">
        <IconArrowLeft size={14} className="icon-rtl-flip" />
        {t('feedback.backToList')}
      </Group>
    </Anchor>
  )
}

function FeedbackNotFound() {
  const { t } = useTranslation('admin')

  return (
    <Container size="lg" px={0}>
      <Stack gap="lg">
        <BackLink />
        <Card withBorder radius="md" padding="xl">
          <Stack align="center" gap="xs" py="md">
            <IconMessageOff
              size={32}
              className="text-[var(--mantine-color-dimmed)]"
            />
            <Title order={4}>{t('feedback.notFoundTitle')}</Title>
            <Text c="dimmed" size="sm" ta="center">
              {t('feedback.notFoundDescription')}
            </Text>
            <Button
              component={Link}
              to="/admin/feedback"
              variant="light"
              mt="sm"
            >
              {t('feedback.backToList')}
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}

function FeedbackDetailPending() {
  return (
    <Container size="lg" px={0}>
      <Stack gap="lg">
        <Group justify="space-between" align="center" wrap="wrap">
          <BackLink />
          <Skeleton height={36} width={100} />
        </Group>

        <Grid gap="md">
          <Grid.Col span={12}>
            <Card withBorder radius="md" padding="lg">
              <Stack gap="md">
                <Skeleton height={16} width={140} />
                <Skeleton height={80} />
                <Skeleton height={36} width={220} />
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  )
}

function FeedbackDetailPage() {
  const { feedbackId } = Route.useParams()
  const id = Number(feedbackId)
  const queryClient = useQueryClient()

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['feedback'] })

  return (
    <DetailPageLayout
      backLink={<BackLink />}
      actions={<FeedbackDetailActions feedbackId={id} />}
    >
      <FeedbackDetailForm feedbackId={id} onSaved={invalidate} />
    </DetailPageLayout>
  )
}
