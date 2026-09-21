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
import { deleteFeedbackFn } from '#/server/actions/feedback.action'
import type { listFeedback } from '#/server/services/feedback.service'

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
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
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
          : tCommon('messages.somethingWentWrong'),
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
          {tCommon('table.rowsSelected', { count: feedback.length })}
        </Text>
        <ActionBar.Divider visibleFrom="xs" />

        <Button
          variant="default"
          color="red"
          size="compact-sm"
          leftSection={<IconTrash size={14} />}
          onClick={() => setDeleteRows(feedback)}
        >
          {tCommon('actions.delete')}
        </Button>

        <ActionBar.CloseButton />
      </ActionBar>

      <Modal
        opened={deleteRows.length > 0}
        onClose={() => setDeleteRows([])}
        title={
          deleteRows.length === 1
            ? t('feedback.deleteModal.title')
            : t('feedback.deleteModal.titleBulk', {
                count: deleteRows.length,
              })
        }
      >
        <Stack gap="md">
          <Text size="sm">
            {deleteRows.length === 1
              ? t('feedback.deleteModal.confirmSingle')
              : t('feedback.deleteModal.confirmBulk', {
                  count: deleteRows.length,
                })}
          </Text>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setDeleteRows([])}>
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
