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

export function RevealApiKeyModal({
  apiKey,
  onClose,
}: {
  apiKey: string | null
  onClose: () => void
}) {
  return (
    <Modal
      opened={apiKey !== null}
      onClose={onClose}
      closeOnClickOutside={false}
      title="API key created"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Copy this key now — you won&apos;t be able to see it again.
        </Text>

        <Group gap="xs" wrap="nowrap">
          <TextInput readOnly value={apiKey ?? ''} flex={1} ff="monospace" />
          <CopyButton value={apiKey ?? ''}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'}>
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
          <Button onClick={onClose}>Done</Button>
        </Group>
      </Stack>
    </Modal>
  )
}
