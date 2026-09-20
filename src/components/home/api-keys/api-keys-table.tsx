import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  EmptyState,
  Group,
  Stack,
  Table,
  Text,
  Tooltip,
} from '@mantine/core'
import {
  IconAlertCircle,
  IconKey,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react'
import { authClient } from '#/lib/auth-client'
import { apiKeysQueryOptions } from '#/lib/queries/api-key'

export function ApiKeysTable({
  onAddKey,
  onChanged,
}: {
  onAddKey: () => void
  onChanged: () => void
}) {
  const { data: apiKeys } = useSuspenseQuery(apiKeysQueryOptions())

  const [actionError, setActionError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setActionError(null)
    setPendingId(id)
    const { error } = await authClient.apiKey.delete({ keyId: id })
    setPendingId(null)

    if (error) {
      setActionError(error.message ?? 'Unable to delete API key')
      return
    }

    onChanged()
  }

  return (
    <Stack gap="md">
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

      <Table.ScrollContainer minWidth={720}>
        <Table verticalSpacing="sm" withTableBorder highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Key</Table.Th>
              <Table.Th>Created</Table.Th>
              <Table.Th>Expires</Table.Th>
              <Table.Th>Last used</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {apiKeys.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <EmptyState
                    icon={<IconKey size={28} />}
                    withIndicatorBackground
                    title="No API keys yet"
                    description="Create a key to access the API programmatically."
                  >
                    <EmptyState.Actions>
                      <Button
                        leftSection={<IconPlus size={16} />}
                        onClick={onAddKey}
                      >
                        Create key
                      </Button>
                    </EmptyState.Actions>
                  </EmptyState>
                </Table.Td>
              </Table.Tr>
            ) : (
              apiKeys.map((apiKey) => (
                <Table.Tr key={apiKey.id}>
                  <Table.Td>
                    <Group gap="xs" wrap="nowrap">
                      <IconKey
                        size={16}
                        className="text-[var(--mantine-color-dimmed)]"
                      />
                      <Text size="sm">{apiKey.name || 'Untitled key'}</Text>
                      {!apiKey.enabled && (
                        <Badge color="gray" variant="light" size="xs">
                          Disabled
                        </Badge>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed" ff="monospace">
                      {(apiKey.start ?? apiKey.prefix ?? '') + '••••••••'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {new Date(apiKey.createdAt).toLocaleDateString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {apiKey.expiresAt
                        ? new Date(apiKey.expiresAt).toLocaleDateString()
                        : 'Never'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {apiKey.lastRequest
                        ? new Date(apiKey.lastRequest).toLocaleDateString()
                        : 'Never'}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Tooltip label="Delete key">
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        loading={pendingId === apiKey.id}
                        onClick={() => handleDelete(apiKey.id)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Stack>
  )
}
