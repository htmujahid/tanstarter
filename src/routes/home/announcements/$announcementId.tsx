import {
  Link,
  createFileRoute,
  notFound,
  useNavigate,
} from '@tanstack/react-router'
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
import { IconArrowLeft, IconBellOff, IconPencil } from '@tabler/icons-react'
import { announcementQueryOptions } from '#/lib/queries/announcements'

export const Route = createFileRoute('/home/announcements/$announcementId')({
  loader: async ({ context, params }) => {
    const id = Number(params.announcementId)
    if (!Number.isInteger(id)) {
      throw notFound()
    }

    try {
      await context.queryClient.query({
        ...announcementQueryOptions(id),
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
    <Anchor component={Link} to="/home/announcements" size="sm" c="dimmed">
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
              to="/home/announcements"
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
  const { data: announcement } = useSuspenseQuery(
    announcementQueryOptions(Number(announcementId)),
  )
  const { session } = Route.useRouteContext()
  const navigate = useNavigate()

  return (
    <Container size="md" px={0}>
      <Stack gap="lg">
        <Group justify="space-between" align="center" wrap="wrap">
          <BackLink />
          {session.user.role === 'admin' && (
            <Button
              variant="light"
              size="xs"
              leftSection={<IconPencil size={14} />}
              onClick={() =>
                navigate({
                  to: '/admin/announcements/$announcementId',
                  params: { announcementId: String(announcement.id) },
                })
              }
            >
              Edit
            </Button>
          )}
        </Group>

        <Card withBorder radius="md" padding="lg">
          <Stack gap="md">
            <Group justify="space-between" align="flex-start" wrap="wrap">
              <Title order={2}>{announcement.title}</Title>
              {!announcement.published && (
                <Badge color="gray" variant="light" size="sm">
                  Draft
                </Badge>
              )}
            </Group>

            <Text c="dimmed" size="sm">
              {new Date(
                announcement.createdAt.replace(' ', 'T') + 'Z',
              ).toLocaleString()}
            </Text>

            {announcement.body && (
              <Text style={{ whiteSpace: 'pre-wrap' }}>
                {announcement.body}
              </Text>
            )}
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}
