import { useState } from 'react'
import { ActionBar, Alert, Button, Group, Modal, Stack, Text } from '@mantine/core'
import { IconAlertCircle, IconTrash } from '@tabler/icons-react'
import { deleteNoteFn } from '#/server/actions/notes'
import type { Note } from '#/server/db'

export function NotesBulkActionBar({
  notes,
  onClearSelection,
  onChanged,
}: {
  notes: Note[]
  onClearSelection: () => void
  onChanged: () => void
}) {
  const [actionError, setActionError] = useState<string | null>(null)
  const [deleteNotes, setDeleteNotes] = useState<Note[]>([])
  const [pending, setPending] = useState(false)

  async function handleBulkDelete() {
    setActionError(null)
    setPending(true)

    const results = await Promise.allSettled(
      deleteNotes.map((note) => deleteNoteFn({ data: { id: note.id } })),
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

    setDeleteNotes([])
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

      <ActionBar opened={notes.length > 0} onClose={onClearSelection}>
        <Text size="sm" fw={500} visibleFrom="xs">
          {notes.length} selected
        </Text>
        <ActionBar.Divider visibleFrom="xs" />

        <Button
          variant="default"
          color="red"
          size="compact-sm"
          leftSection={<IconTrash size={14} />}
          onClick={() => setDeleteNotes(notes)}
        >
          Delete
        </Button>

        <ActionBar.CloseButton />
      </ActionBar>

      <Modal
        opened={deleteNotes.length > 0}
        onClose={() => setDeleteNotes([])}
        title={
          deleteNotes.length === 1 ? `Delete note` : `Delete ${deleteNotes.length} notes`
        }
      >
        <Stack gap="md">
          <Text size="sm">
            Permanently delete{' '}
            {deleteNotes.length === 1 ? (
              <strong>{deleteNotes[0].title}</strong>
            ) : (
              `${deleteNotes.length} notes`
            )}
            ? This cannot be undone.
          </Text>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setDeleteNotes([])}>
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
