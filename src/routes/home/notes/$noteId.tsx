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
import { IconArrowLeft, IconNoteOff } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { DetailPageLayout } from '#/components/layout/detail-page-layout'
import { NoteDetailActions } from '#/components/home/notes/note-detail-actions'
import { NoteDetailsForm } from '#/components/home/notes/note-details-form'
import { notesCollectionOptions } from '#/lib/collections/notes'

export const Route = createFileRoute('/home/notes/$noteId')({
  loader: async ({ context, params }) => {
    const id = Number(params.noteId)
    if (!Number.isInteger(id)) {
      throw notFound()
    }

    const collection = context.dbClient.collection(notesCollectionOptions)
    await collection.preload()

    if (!collection.has(id)) {
      throw notFound()
    }
  },
  pendingComponent: NoteDetailPending,
  notFoundComponent: NoteNotFound,
  staticData: { breadcrumb: 'Note details' },
  component: NoteDetailPage,
})

function BackLink() {
  const { t } = useTranslation('home')

  return (
    <Anchor component={Link} to="/home/notes" size="sm" c="dimmed">
      <Group gap={4} wrap="nowrap">
        <IconArrowLeft size={14} className="icon-rtl-flip" />
        {t('notes.backToNotes')}
      </Group>
    </Anchor>
  )
}

function NoteNotFound() {
  const { t } = useTranslation('home')

  return (
    <Container size="lg" px={0}>
      <Stack gap="lg">
        <BackLink />
        <Card withBorder radius="md" padding="xl">
          <Stack align="center" gap="xs" py="md">
            <IconNoteOff
              size={32}
              className="text-[var(--mantine-color-dimmed)]"
            />
            <Title order={4}>{t('notes.notFound.title')}</Title>
            <Text c="dimmed" size="sm" ta="center">
              {t('notes.notFound.description')}
            </Text>
            <Button component={Link} to="/home/notes" variant="light" mt="sm">
              {t('notes.backToNotes')}
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}

function NoteDetailPending() {
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

function NoteDetailPage() {
  const { noteId } = Route.useParams()
  const id = Number(noteId)

  return (
    <DetailPageLayout
      backLink={<BackLink />}
      actions={<NoteDetailActions noteId={id} />}
    >
      <NoteDetailsForm noteId={id} />
    </DetailPageLayout>
  )
}
