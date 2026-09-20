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
import { deleteContactSubmissionFn } from '#/server/actions/contact'
import type { ContactSubmission } from '#/server/db/schemas'

export function ContactsBulkActionBar({
  contacts,
  onClearSelection,
  onChanged,
}: {
  contacts: ContactSubmission[]
  onClearSelection: () => void
  onChanged: () => void
}) {
  const [actionError, setActionError] = useState<string | null>(null)
  const [deleteRows, setDeleteRows] = useState<ContactSubmission[]>([])
  const [pending, setPending] = useState(false)

  async function handleBulkDelete() {
    setActionError(null)
    setPending(true)

    const results = await Promise.allSettled(
      deleteRows.map((row) =>
        deleteContactSubmissionFn({ data: { id: row.id } }),
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

    setDeleteRows([])
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

      <ActionBar opened={contacts.length > 0} onClose={onClearSelection}>
        <Text size="sm" fw={500} visibleFrom="xs">
          {contacts.length} selected
        </Text>
        <ActionBar.Divider visibleFrom="xs" />

        <Button
          variant="default"
          color="red"
          size="compact-sm"
          leftSection={<IconTrash size={14} />}
          onClick={() => setDeleteRows(contacts)}
        >
          Delete
        </Button>

        <ActionBar.CloseButton />
      </ActionBar>

      <Modal
        opened={deleteRows.length > 0}
        onClose={() => setDeleteRows([])}
        title={
          deleteRows.length === 1
            ? 'Delete submission'
            : `Delete ${deleteRows.length} submissions`
        }
      >
        <Stack gap="md">
          <Text size="sm">
            Permanently delete{' '}
            {deleteRows.length === 1 ? (
              <strong>{deleteRows[0].name}</strong>
            ) : (
              `${deleteRows.length} submissions`
            )}
            ? This cannot be undone.
          </Text>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setDeleteRows([])}>
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
