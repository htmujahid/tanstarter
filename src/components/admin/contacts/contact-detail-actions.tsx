import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Alert, Button, Group, Modal, Stack, Text } from '@mantine/core'
import { IconAlertCircle, IconTrash } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { deleteContactSubmissionFn } from '#/server/actions/contact'

export function ContactDetailActions({ contactId }: { contactId: number }) {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const navigate = useNavigate()
  const [actionError, setActionError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  async function handleDelete() {
    setActionError(null)
    setPending(true)

    try {
      await deleteContactSubmissionFn({ data: { id: contactId } })
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
    await navigate({ to: '/admin/contacts', search: { page: 1 } })
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
        title={t('contacts.deleteModal.title')}
      >
        <Stack gap="md">
          <Text size="sm">{t('contacts.deleteModal.confirmMessage')}</Text>
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
