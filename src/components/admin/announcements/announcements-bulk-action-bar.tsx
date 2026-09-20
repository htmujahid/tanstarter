import { useState } from 'react'
import {
  ActionBar,
  Alert,
  Button,
  Group,
  Modal,
  Stack,
  Text,
} from '@mantine/core'
import { IconAlertCircle, IconTrash } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { deleteAnnouncementFn } from '#/server/actions/announcements'
import type { Announcement } from '#/server/db'

export function AnnouncementsBulkActionBar({
  announcements,
  onClearSelection,
  onChanged,
}: {
  announcements: Announcement[]
  onClearSelection: () => void
  onChanged: () => void
}) {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const [actionError, setActionError] = useState<string | null>(null)
  const [deleteAnnouncements, setDeleteAnnouncements] = useState<
    Announcement[]
  >([])
  const [pending, setPending] = useState(false)

  async function handleBulkDelete() {
    setActionError(null)
    setPending(true)

    const results = await Promise.allSettled(
      deleteAnnouncements.map((announcement) =>
        deleteAnnouncementFn({ data: { id: announcement.id } }),
      ),
    )
    setPending(false)

    const failed = results.find(
      (result): result is PromiseRejectedResult => result.status === 'rejected',
    )
    if (failed) {
      setActionError(
        failed.reason instanceof Error
          ? failed.reason.message
          : tCommon('messages.somethingWentWrong'),
      )
      return
    }

    setDeleteAnnouncements([])
    onClearSelection()
    onChanged()
  }

  return (
    <>
      {actionError && (
        <Alert
          color="red"
          icon={<IconAlertCircle size={16} />}
          withCloseButton
          onClose={() => setActionError(null)}
        >
          {actionError}
        </Alert>
      )}

      <ActionBar opened={announcements.length > 0} onClose={onClearSelection}>
        <Text size="sm" fw={500} visibleFrom="xs">
          {tCommon('table.rowsSelected', { count: announcements.length })}
        </Text>
        <ActionBar.Divider visibleFrom="xs" />

        <Button
          variant="default"
          color="red"
          size="compact-sm"
          leftSection={<IconTrash size={14} />}
          onClick={() => setDeleteAnnouncements(announcements)}
        >
          {tCommon('actions.delete')}
        </Button>

        <ActionBar.CloseButton />
      </ActionBar>

      <Modal
        opened={deleteAnnouncements.length > 0}
        onClose={() => setDeleteAnnouncements([])}
        title={
          deleteAnnouncements.length === 1
            ? t('announcements.deleteModal.title')
            : t('announcements.deleteModal.titleBulk', {
                count: deleteAnnouncements.length,
              })
        }
      >
        <Stack gap="md">
          <Text size="sm">
            {t('announcements.deleteModal.confirmPrefix')}{' '}
            {deleteAnnouncements.length === 1 ? (
              <strong>{deleteAnnouncements[0].title}</strong>
            ) : (
              t('announcements.deleteModal.itemsCount', {
                count: deleteAnnouncements.length,
              })
            )}
            {t('announcements.deleteModal.confirmSuffix')}
          </Text>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setDeleteAnnouncements([])}>
              {tCommon('actions.cancel')}
            </Button>
            <Button color="red" loading={pending} onClick={handleBulkDelete}>
              {tCommon('actions.delete')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}
