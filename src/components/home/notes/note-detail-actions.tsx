import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Alert, Button, Group, Modal, Stack, Text } from '@mantine/core'
import { IconAlertCircle, IconTrash } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { deleteNoteFn } from '#/server/actions/notes'
import { noteQueryOptions } from '#/lib/queries/notes'

export function NoteDetailActions({ noteId }: { noteId: number }) {
  const { t } = useTranslation('home')
  const { t: tCommon } = useTranslation('common')
  const { data: note } = useSuspenseQuery(noteQueryOptions(noteId))
  const navigate = useNavigate()
  const [actionError, setActionError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  async function handleDelete() {
    setActionError(null)
    setPending(true)

    try {
      await deleteNoteFn({ data: { id: note.id } })
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
    await navigate({ to: '/home/notes', search: { page: 1 } })
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
          {t('notes.actions.deleteButton')}
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
        title={tCommon('confirmDelete.title', { item: note.title })}
      >
        <Stack gap="md">
          <Text size="sm">{tCommon('confirmDelete.description')}</Text>
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
