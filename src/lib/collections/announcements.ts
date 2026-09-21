import { QueryClient } from '@tanstack/react-query'
import { createCollection } from '@tanstack/react-db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import {
  createAnnouncementFn,
  deleteAnnouncementFn,
  listAnnouncementsFn,
  updateAnnouncementFn,
} from '#/server/actions/announcements'
import type { Announcement } from '#/server/db'

/**
 * Admin announcements are a small, bounded CMS-style dataset, so the whole
 * admin-visible set is loaded into this collection once and filtered/sorted
 * /paged client-side via live queries. Higher-volume lists (feedback,
 * contact, admin users) keep server-side pagination instead — see
 * `src/lib/queries/*` for those.
 *
 * Collections are client-only (no SSR support yet), so every route that uses
 * this one must set `ssr: false`.
 */
const ANNOUNCEMENTS_COLLECTION_LIMIT = 1000

// Dedicated QueryClient for TanStack DB collections — kept separate from the
// router's per-request QueryClient (src/router.tsx), since collections only
// ever run in the browser and don't need to share cache/devtools with SSR'd
// React Query data.
const collectionsQueryClient = new QueryClient()

export const announcementsCollection = createCollection(
  queryCollectionOptions({
    id: 'announcements',
    queryKey: ['announcements', 'collection'],
    queryClient: collectionsQueryClient,
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
