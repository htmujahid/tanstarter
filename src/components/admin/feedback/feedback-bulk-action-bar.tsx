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
import { deleteFeedbackFn } from '#/server/actions/feedback'
import type { listFeedback } from '#/server/services/feedback'

type FeedbackRow = Awaited<ReturnType<typeof listFeedback>>['feedback'][number]

export function FeedbackBulkActionBar({
  feedback,
  onClearSelection,
  onChanged,
}: {
  feedback: FeedbackRow[]
  onClearSelection: () => void
  onChanged: () => void
}) {
  const [actionError, setActionError] = useState<string | null>(null)
  const [deleteRows, setDeleteRows] = useState<FeedbackRow[]>([])
  const [pending, setPending] = useState(false)

  async function handleBulkDelete() {
    setActionError(null)
    setPending(true)

    const results = await Promise.allSettled(
      deleteRows.map((row) => deleteFeedbackFn({ data: { id: row.id } })),
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

      <ActionBar opened={feedback.length > 0} onClose={onClearSelection}>
        <Text size="sm" fw={500} visibleFrom="xs">
          {feedback.length} selected
        </Text>
        <ActionBar.Divider visibleFrom="xs" />

        <Button
          variant="default"
          color="red"
          size="compact-sm"
          leftSection={<IconTrash size={14} />}
          onClick={() => setDeleteRows(feedback)}
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
            ? 'Delete feedback'
            : `Delete ${deleteRows.length} feedback entries`
        }
      >
        <Stack gap="md">
          <Text size="sm">
            Permanently delete{' '}
            {deleteRows.length === 1
              ? 'this feedback entry'
              : `${deleteRows.length} feedback entries`}
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
