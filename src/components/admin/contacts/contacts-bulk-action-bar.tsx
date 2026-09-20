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
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
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

      <ActionBar opened={contacts.length > 0} onClose={onClearSelection}>
        <Text size="sm" fw={500} visibleFrom="xs">
          {tCommon('table.rowsSelected', { count: contacts.length })}
        </Text>
        <ActionBar.Divider visibleFrom="xs" />

        <Button
          variant="default"
          color="red"
          size="compact-sm"
          leftSection={<IconTrash size={14} />}
          onClick={() => setDeleteRows(contacts)}
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
            ? t('contacts.deleteModal.title')
            : t('contacts.deleteModal.titleBulk', {
                count: deleteRows.length,
              })
        }
      >
        <Stack gap="md">
          <Text size="sm">
            {t('contacts.deleteModal.confirmPrefix')}{' '}
            {deleteRows.length === 1 ? (
              <strong>{deleteRows[0].name}</strong>
            ) : (
              t('contacts.deleteModal.itemsCount', {
                count: deleteRows.length,
              })
            )}
            {t('contacts.deleteModal.confirmSuffix')}
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
