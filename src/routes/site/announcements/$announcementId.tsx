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
import { IconArrowLeft, IconBellOff } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { AnnouncementDetail } from '#/components/site/announcements/announcement-detail'
import { siteAnnouncementQueryOptions } from '#/lib/queries/announcements.query'

export const Route = createFileRoute('/site/announcements/$announcementId')({
  loader: async ({ context, params }) => {
    const id = Number(params.announcementId)
    if (!Number.isInteger(id)) {
      throw notFound()
    }

    try {
      await context.queryClient.query({
        ...siteAnnouncementQueryOptions(id),
        staleTime: 'static',
      })
    } catch {
      throw notFound()
    }
  },
  pendingComponent: AnnouncementDetailPending,
  notFoundComponent: AnnouncementNotFound,
  staticData: { breadcrumb: 'Announcement' },
  component: AnnouncementDetailPage,
})

function BackLink() {
  const { t } = useTranslation('site')

  return (
    <Anchor component={Link} to="/site/announcements" size="sm" c="dimmed">
      <Group gap={4} wrap="nowrap">
        <IconArrowLeft size={14} className="icon-rtl-flip" />
        {t('announcements.backLink')}
      </Group>
    </Anchor>
  )
}

function AnnouncementNotFound() {
  const { t } = useTranslation('site')

  return (
    <Container size="md" px={0}>
      <Stack gap="lg">
        <BackLink />
        <Card withBorder radius="md" padding="xl">
          <Stack align="center" gap="xs" py="md">
            <IconBellOff
              size={32}
              className="text-[var(--mantine-color-dimmed)]"
            />
            <Title order={4}>{t('announcements.notFound.title')}</Title>
            <Text c="dimmed" size="sm" ta="center">
              {t('announcements.notFound.description')}
            </Text>
            <Button
              component={Link}
              to="/site/announcements"
              variant="light"
              mt="sm"
            >
              {t('announcements.backLink')}
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}

function AnnouncementDetailPending() {
  return (
    <Container size="md" px={0}>
      <Stack gap="lg">
        <BackLink />
        <Card withBorder radius="md" padding="lg">
          <Stack gap="md">
            <Skeleton height={28} width={240} />
            <Skeleton height={14} width={120} />
            <Skeleton height={100} />
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}

function AnnouncementDetailPage() {
  const { announcementId } = Route.useParams()

  return (
    <Container size="md" px={0}>
      <Stack gap="lg">
        <BackLink />
        <AnnouncementDetail announcementId={Number(announcementId)} />
      </Stack>
    </Container>
  )
}
