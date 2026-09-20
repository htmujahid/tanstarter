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
import { AnnouncementDetail } from '#/components/site/announcements/announcement-detail'
import { siteAnnouncementQueryOptions } from '#/lib/queries/announcements'

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
  return (
    <Anchor component={Link} to="/site/announcements" size="sm" c="dimmed">
      <Group gap={4} wrap="nowrap">
        <IconArrowLeft size={14} />
        Back to announcements
      </Group>
    </Anchor>
  )
}

function AnnouncementNotFound() {
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
            <Title order={4}>Announcement not found</Title>
            <Text c="dimmed" size="sm" ta="center">
              This announcement may have been removed, or the link is no longer
              valid.
            </Text>
            <Button
              component={Link}
              to="/site/announcements"
              variant="light"
              mt="sm"
            >
              Back to announcements
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
