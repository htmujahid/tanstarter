import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Alert, Button, Group, Modal, Stack, Text } from '@mantine/core'
import { IconAlertCircle, IconTrash } from '@tabler/icons-react'
import { deleteAnnouncementFn } from '#/server/actions/announcements'
import type { Announcement } from '#/server/db'

export function AnnouncementDetailActions({
  announcement,
}: {
  announcement: Announcement
}) {
  const navigate = useNavigate()
  const [actionError, setActionError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  async function handleDelete() {
    setActionError(null)
    setPending(true)

    try {
      await deleteAnnouncementFn({ data: { id: announcement.id } })
    } catch (error) {
      setPending(false)
      setActionError(
        error instanceof Error ? error.message : 'Something went wrong',
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
          Delete
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
        title="Delete announcement"
      >
        <Stack gap="md">
          <Text size="sm">
            Permanently delete <strong>{announcement.title}</strong>? This
            cannot be undone.
          </Text>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button color="red" loading={pending} onClick={handleDelete}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
}
