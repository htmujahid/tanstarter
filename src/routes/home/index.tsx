import { useLiveQuery } from '@tanstack/react-db'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Container, SimpleGrid, Skeleton } from '@mantine/core'
import { IconKey, IconNotes } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { StatCard } from '#/components/dashboard/stat-card'
import { notesCollectionOptions } from '#/lib/collections/notes.collection'
import { apiKeysQueryOptions } from '#/lib/queries/api-key.query'

export const Route = createFileRoute('/home/')({
  loader: ({ context }) =>
    Promise.all([
      context.dbClient.collection(notesCollectionOptions).preload(),
      context.queryClient.query({
        ...apiKeysQueryOptions(),
        staleTime: 'static',
      }),
    ]),
  pendingComponent: HomeSkeleton,
  component: Home,
})

function HomeSkeleton() {
  return (
    <Container size="lg" px={0}>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <Skeleton height={104} radius="md" />
        <Skeleton height={104} radius="md" />
      </SimpleGrid>
    </Container>
  )
}

function Home() {
  const { t } = useTranslation('home')
  const { data: notes } = useLiveQuery({
    query: (query) => query.from({ note: notesCollectionOptions }),
  })
  const { data: apiKeys } = useQuery(apiKeysQueryOptions())

  return (
    <Container size="lg" px={0}>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <StatCard
          label={t('dashboard.stats.notes')}
          value={notes.length.toLocaleString()}
          icon={IconNotes}
        />
        <StatCard
          label={t('dashboard.stats.apiKeys')}
          value={(apiKeys ?? []).length.toLocaleString()}
          icon={IconKey}
        />
      </SimpleGrid>
    </Container>
  )
}
