import { Link, createFileRoute, notFound } from '@tanstack/react-router'
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
import { IconArrowLeft, IconBellOff } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { DetailPageLayout } from '#/components/layout/detail-page-layout'
import { AnnouncementDetailActions } from '#/components/admin/announcements/announcement-detail-actions'
import { AnnouncementDetailsForm } from '#/components/admin/announcements/announcement-details-form'
import { announcementsCollectionOptions } from '#/lib/collections/announcements.collection'

export const Route = createFileRoute('/admin/announcements/$announcementId')({
  loader: async ({ context, params }) => {
    const id = Number(params.announcementId)
    if (!Number.isInteger(id)) {
      throw notFound()
    }

    const collection = context.dbClient.collection(announcementsCollectionOptions)
    await collection.preload()

    if (!collection.has(id)) {
      throw notFound()
    }
  },
  pendingComponent: AnnouncementDetailPending,
  notFoundComponent: AnnouncementNotFound,
  staticData: { breadcrumb: 'Announcement details' },
  component: AnnouncementDetailPage,
})

function BackLink() {
  const { t } = useTranslation('admin')

  return (
    <Anchor component={Link} to="/admin/announcements" size="sm" c="dimmed">
      <Group gap={4} wrap="nowrap">
        <IconArrowLeft size={14} className="icon-rtl-flip" />
        {t('announcements.backToList')}
      </Group>
    </Anchor>
  )
}

function AnnouncementNotFound() {
  const { t } = useTranslation('admin')

  return (
    <Container size="lg" px={0}>
      <Stack gap="lg">
        <BackLink />
        <Card withBorder radius="md" padding="xl">
          <Stack align="center" gap="xs" py="md">
            <IconBellOff
              size={32}
              className="text-[var(--mantine-color-dimmed)]"
            />
            <Title order={4}>{t('announcements.notFoundTitle')}</Title>
            <Text c="dimmed" size="sm" ta="center">
              {t('announcements.notFoundDescription')}
            </Text>
            <Button
              component={Link}
              to="/admin/announcements"
              variant="light"
              mt="sm"
            >
              {t('announcements.backToList')}
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}

function AnnouncementDetailPending() {
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
                <Skeleton height={36} />
                <Skeleton height={100} />
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  )
}

function AnnouncementDetailPage() {
  const { announcementId } = Route.useParams()
  const id = Number(announcementId)

  return (
    <DetailPageLayout
      backLink={<BackLink />}
      actions={<AnnouncementDetailActions announcementId={id} />}
    >
      <AnnouncementDetailsForm announcementId={id} />
    </DetailPageLayout>
  )
}
