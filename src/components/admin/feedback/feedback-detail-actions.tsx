import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Alert, Button, Group, Modal, Stack, Text } from '@mantine/core'
import { IconAlertCircle, IconTrash } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { deleteFeedbackFn } from '#/server/actions/feedback'

export function FeedbackDetailActions({ feedbackId }: { feedbackId: number }) {
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
      await deleteFeedbackFn({ data: { id: feedbackId } })
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
    await navigate({ to: '/admin/feedback', search: { page: 1 } })
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
        title={t('feedback.deleteModal.title')}
      >
        <Stack gap="md">
          <Text size="sm">{t('feedback.deleteModal.confirmSingle')}</Text>
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
