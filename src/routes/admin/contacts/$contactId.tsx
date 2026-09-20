import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
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
import { IconArrowLeft, IconMailOff } from '@tabler/icons-react'
import { DetailPageLayout } from '#/components/layout/detail-page-layout'
import { ContactDetailActions } from '#/components/admin/contacts/contact-detail-actions'
import { contactQueryOptions } from '#/lib/queries/contact'

export const Route = createFileRoute('/admin/contacts/$contactId')({
  loader: async ({ context, params }) => {
    const id = Number(params.contactId)
    if (!Number.isInteger(id)) {
      throw notFound()
    }

    try {
      await context.queryClient.query({
        ...contactQueryOptions(id),
        staleTime: 'static',
      })
    } catch {
      throw notFound()
    }
  },
  pendingComponent: ContactDetailPending,
  notFoundComponent: ContactNotFound,
  staticData: { breadcrumb: 'Submission details' },
  component: ContactDetailPage,
})

function BackLink() {
  return (
    <Anchor component={Link} to="/admin/contacts" size="sm" c="dimmed">
      <Group gap={4} wrap="nowrap">
        <IconArrowLeft size={14} />
        Back to contact submissions
      </Group>
    </Anchor>
  )
}

function ContactNotFound() {
  return (
    <Container size="lg" px={0}>
      <Stack gap="lg">
        <BackLink />
        <Card withBorder radius="md" padding="xl">
          <Stack align="center" gap="xs" py="md">
            <IconMailOff
              size={32}
              className="text-[var(--mantine-color-dimmed)]"
            />
            <Title order={4}>Submission not found</Title>
            <Text c="dimmed" size="sm" ta="center">
              This submission may have been deleted, or the link is no longer
              valid.
            </Text>
            <Button
              component={Link}
              to="/admin/contacts"
              variant="light"
              mt="sm"
            >
              Back to contact submissions
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}

function ContactDetailPending() {
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
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  )
}

function ContactDetailPage() {
  const { contactId } = Route.useParams()
  const { data: contact } = useSuspenseQuery(
    contactQueryOptions(Number(contactId)),
  )

  return (
    <DetailPageLayout
      backLink={<BackLink />}
      actions={<ContactDetailActions contactId={contact.id} />}
      main={
        <Card withBorder radius="md" padding="lg">
          <Stack gap="md">
            <Stack gap={2}>
              <Title order={4}>{contact.name}</Title>
              <Text c="dimmed" size="sm">
                {contact.email}
              </Text>
            </Stack>

            <Text style={{ whiteSpace: 'pre-wrap' }}>{contact.message}</Text>

            <Text c="dimmed" size="sm">
              Submitted{' '}
              {new Date(
                contact.createdAt.replace(' ', 'T') + 'Z',
              ).toLocaleString()}
            </Text>
          </Stack>
        </Card>
      }
    />
  )
}
