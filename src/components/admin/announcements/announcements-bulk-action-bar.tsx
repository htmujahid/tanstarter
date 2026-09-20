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
          : 'Something went wrong',
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
          {announcements.length} selected
        </Text>
        <ActionBar.Divider visibleFrom="xs" />

        <Button
          variant="default"
          color="red"
          size="compact-sm"
          leftSection={<IconTrash size={14} />}
          onClick={() => setDeleteAnnouncements(announcements)}
        >
          Delete
        </Button>

        <ActionBar.CloseButton />
      </ActionBar>

      <Modal
        opened={deleteAnnouncements.length > 0}
        onClose={() => setDeleteAnnouncements([])}
        title={
          deleteAnnouncements.length === 1
            ? `Delete announcement`
            : `Delete ${deleteAnnouncements.length} announcements`
        }
      >
        <Stack gap="md">
          <Text size="sm">
            Permanently delete{' '}
            {deleteAnnouncements.length === 1 ? (
              <strong>{deleteAnnouncements[0].title}</strong>
            ) : (
              `${deleteAnnouncements.length} announcements`
            )}
            ? This cannot be undone.
          </Text>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setDeleteAnnouncements([])}>
              Cancel
            </Button>
            <Button color="red" loading={pending} onClick={handleBulkDelete}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}
