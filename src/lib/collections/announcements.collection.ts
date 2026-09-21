import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { collectionOptions } from '@tanstack/react-db'
import type { QueryClient } from '@tanstack/react-query'

import {
  createAnnouncementFn,
  deleteAnnouncementFn,
  listAnnouncementsFn,
  updateAnnouncementFn,
} from '#/server/actions/announcements.action'
import type { Announcement } from '#/server/db'

const ANNOUNCEMENTS_COLLECTION_LIMIT = 1000

export const announcementsCollectionOptions = collectionOptions(
  'announcements',
  (client) =>
    queryCollectionOptions({
      id: 'announcements',
      queryKey: ['announcements', 'collection'],
      queryClient: client.requireDependency<QueryClient>('queryClient'),
      getKey: (announcement: Announcement) => announcement.id,
      queryFn: async () => {
        const { announcements } = await listAnnouncementsFn({
          data: { limit: ANNOUNCEMENTS_COLLECTION_LIMIT, offset: 0 },
        })
        return announcements
      },
      onInsert: async ({ transaction }) => {
        await Promise.all(
          transaction.mutations.map(({ modified }) =>
            createAnnouncementFn({
              data: {
                title: modified.title,
                body: modified.body ?? undefined,
                published: modified.published,
              },
            }),
          ),
        )
      },
      onUpdate: async ({ transaction }) => {
        await Promise.all(
          transaction.mutations.map(({ key, changes }) =>
            updateAnnouncementFn({
              data: {
                id: key,
                title: changes.title,
                body: changes.body ?? undefined,
                published: changes.published,
              },
            }),
          ),
        )
      },
      onDelete: async ({ transaction }) => {
        await Promise.all(
          transaction.mutations.map(({ key }) =>
            deleteAnnouncementFn({ data: { id: key } }),
          ),
        )
      },
    }),
)
