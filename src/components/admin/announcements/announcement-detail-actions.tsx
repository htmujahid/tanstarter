import { useState } from 'react'
import { eq, useDbClient, useLiveQuery } from '@tanstack/react-db'
import { useNavigate } from '@tanstack/react-router'
import { Alert, Button, Group, Modal, Stack, Text } from '@mantine/core'
import { IconAlertCircle, IconTrash } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { announcementsCollectionOptions } from '#/lib/collections/announcements.collection'

export function AnnouncementDetailActions({
  announcementId,
}: {
  announcementId: number
}) {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const dbClient = useDbClient()
  const { data } = useLiveQuery({
    query: (q) =>
      q
        .from({ announcement: announcementsCollectionOptions })
        .where(({ announcement }) => eq(announcement.id, announcementId)),
  })
  const navigate = useNavigate()
  const [actionError, setActionError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  if (data.length === 0) return null
  const announcement = data[0]

  async function handleDelete() {
    setActionError(null)
    setPending(true)

    try {
      await dbClient
        .collection(announcementsCollectionOptions)
        .delete(announcement.id).isPersisted.promise
    } catch (error) {
      setPending(false)
      setActionError(
        error instanceof Error
          ? error.message
          : tCommon('messages.somethingWentWrong'),
      )
      return
    }

    setPending(false)
    await navigate({ to: '/admin/announcements', search: { page: 1 } })
  }

  return (
    <Stack gap="xs" align="flex-end">
      <Group gap="xs" wrap="wrap" justify="flex-end">
        <Button
          variant="light"
          color="red"
          leftSection={<IconTrash size={16} />}
          onClick={() => setDeleteModalOpen(true)}
        >
          {tCommon('actions.delete')}
        </Button>
      </Group>

      {actionError && (
        <Alert
          color="red"
          icon={<IconAlertCircle size={16} />}
          withCloseButton
          onClose={() => setActionError(null)}
          className="w-full"
        >
          {actionError}
        </Alert>
      )}

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t('announcements.deleteModal.title')}
      >
        <Stack gap="md">
          <Text size="sm">
            {t('announcements.deleteModal.confirmPrefix')}{' '}
            <strong>{announcement.title}</strong>
            {t('announcements.deleteModal.confirmSuffix')}
          </Text>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setDeleteModalOpen(false)}>
              {tCommon('actions.cancel')}
            </Button>
            <Button color="red" loading={pending} onClick={handleDelete}>
              {tCommon('actions.delete')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
}
