import {
  ActionIcon,
  Button,
  CopyButton,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { IconCheck, IconCopy } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export function RevealApiKeyModal({
  apiKey,
  onClose,
}: {
  apiKey: string | null
  onClose: () => void
}) {
  const { t } = useTranslation('home')

  return (
    <Modal
      opened={apiKey !== null}
      onClose={onClose}
      closeOnClickOutside={false}
      title={t('apiKeys.revealModal.title')}
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          {t('apiKeys.revealModal.description')}
        </Text>

        <Group gap="xs" wrap="nowrap">
          <TextInput readOnly value={apiKey ?? ''} flex={1} ff="monospace" />
          <CopyButton value={apiKey ?? ''}>
            {({ copied, copy }) => (
              <Tooltip
                label={
                  copied
                    ? t('apiKeys.revealModal.copiedTooltip')
                    : t('apiKeys.revealModal.copyTooltip')
                }
              >
                <ActionIcon
                  variant="light"
                  color={copied ? 'teal' : undefined}
                  onClick={copy}
                >
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>

        <Group justify="flex-end">
          <Button onClick={onClose}>{t('apiKeys.revealModal.done')}</Button>
        </Group>
      </Stack>
    </Modal>
  )
}
