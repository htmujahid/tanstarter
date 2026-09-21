import { useState } from 'react'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core'
import {
  IconAlertCircle,
  IconFingerprint,
  IconTrash,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { authClient } from '#/lib/auth-client'
import { passkeysQueryOptions } from '#/lib/queries/passkey.query'

export function PasskeysList() {
  const { t } = useTranslation('profile')
  const { t: tCommon } = useTranslation('common')
  const queryClient = useQueryClient()
  const { data: passkeys } = useSuspenseQuery(passkeysQueryOptions())

  const [actionError, setActionError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [addOpened, setAddOpened] = useState(false)
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['passkey', 'list'] })

  async function handleAdd() {
    setActionError(null)
    setAdding(true)
    const { error } = await authClient.passkey.addPasskey({
      name: newName.trim() || undefined,
    })
    setAdding(false)

    if (error) {
      setActionError(error.message ?? t('passkeys.addError'))
      return
    }

    setAddOpened(false)
    setNewName('')
    invalidate()
  }

  async function handleDelete(id: string) {
    setActionError(null)
    setPendingId(id)
    const { error } = await authClient.passkey.deletePasskey({ id })
    setPendingId(null)

    if (error) {
      setActionError(error.message ?? t('passkeys.deleteError'))
      return
    }

    invalidate()
  }

  return (
    <Card withBorder radius="md" padding="lg">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Stack gap={2}>
            <Title order={3}>{t('passkeys.title')}</Title>
            <Text c="dimmed" size="sm">
              {t('passkeys.subtitle')}
            </Text>
          </Stack>

          <Button
            variant="light"
            size="xs"
            leftSection={<IconFingerprint size={16} />}
            onClick={() => setAddOpened(true)}
          >
            {t('passkeys.addButton')}
          </Button>
        </Group>

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

        {passkeys.length === 0 ? (
          <Text size="sm" c="dimmed">
            {t('passkeys.emptyState')}
          </Text>
        ) : (
          <Table.ScrollContainer minWidth={480}>
            <Table verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t('passkeys.nameColumn')}</Table.Th>
                  <Table.Th>{t('passkeys.typeColumn')}</Table.Th>
                  <Table.Th>{t('passkeys.addedColumn')}</Table.Th>
                  <Table.Th />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {passkeys.map((passkey) => (
                  <Table.Tr key={passkey.id}>
                    <Table.Td>
                      <Group gap="xs" wrap="nowrap">
                        <IconFingerprint
                          size={16}
                          className="text-[var(--mantine-color-dimmed)]"
                        />
                        <Text size="sm">
                          {passkey.name || t('passkeys.defaultName')}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge color="gray" variant="light" size="xs">
                        {passkey.backedUp
                          ? t('passkeys.synced')
                          : t('passkeys.deviceOnly')}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {new Date(passkey.createdAt).toLocaleString()}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Tooltip label={t('passkeys.removeTooltip')}>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          loading={pendingId === passkey.id}
                          onClick={() => handleDelete(passkey.id)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Stack>

      <Modal
        opened={addOpened}
        onClose={() => setAddOpened(false)}
        title={t('passkeys.modalTitle')}
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            {t('passkeys.modalDescription')}
          </Text>

          <TextInput
            label={t('passkeys.nameFieldLabel')}
            placeholder={t('passkeys.nameFieldPlaceholder')}
            value={newName}
            onChange={(event) => setNewName(event.currentTarget.value)}
          />

          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setAddOpened(false)}>
              {tCommon('actions.cancel')}
            </Button>
            <Button loading={adding} onClick={handleAdd}>
              {t('passkeys.continue')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Card>
  )
}
