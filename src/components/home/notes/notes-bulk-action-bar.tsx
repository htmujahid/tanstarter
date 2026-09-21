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
import { useNotesCollection } from '#/lib/collections/notes'
import { useOfflineExecutor, waitForTransaction } from '#/lib/db/offline-executor'
import type { Note } from '#/server/db'

export function NotesBulkActionBar({
  notes,
  onClearSelection,
}: {
  notes: Note[]
  onClearSelection: () => void
}) {
  const { t } = useTranslation('home')
  const { t: tCommon } = useTranslation('common')
  const executor = useOfflineExecutor()
  const collection = useNotesCollection()
  const [actionError, setActionError] = useState<string | null>(null)
  const [deleteNotes, setDeleteNotes] = useState<Note[]>([])
  const [pending, setPending] = useState(false)

  async function handleBulkDelete() {
    setActionError(null)

    if (!executor) {
      setActionError(tCommon('messages.somethingWentWrong'))
      return
    }

    setPending(true)

    const results = await Promise.allSettled(
      deleteNotes.map((note) => {
        const offlineTx = executor.createOfflineTransaction({
          mutationFnName: 'deleteNote',
        })
        const tx = offlineTx.mutate(() => {
          collection.delete(note.id)
        })
        return waitForTransaction(tx)
      }),
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

    setDeleteNotes([])
    onClearSelection()
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
          {tCommon('table.rowsSelected', { count: notes.length })}
        </Text>
        <ActionBar.Divider visibleFrom="xs" />

        <Button
          variant="default"
          color="red"
          size="compact-sm"
          leftSection={<IconTrash size={14} />}
          onClick={() => setDeleteNotes(notes)}
        >
          {t('notes.bulkActions.deleteButton')}
        </Button>

        <ActionBar.CloseButton />
      </ActionBar>

      <Modal
        opened={deleteNotes.length > 0}
        onClose={() => setDeleteNotes([])}
        title={tCommon('confirmDelete.title', {
          item:
            deleteNotes.length === 1
              ? deleteNotes[0].title
              : t('notes.bulkActions.notesCount', {
                  count: deleteNotes.length,
                }),
        })}
      >
        <Stack gap="md">
          <Text size="sm">{tCommon('confirmDelete.description')}</Text>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setDeleteNotes([])}>
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
