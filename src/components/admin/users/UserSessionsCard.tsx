import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Skeleton,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import { IconAlertCircle, IconDeviceDesktop, IconX } from '@tabler/icons-react'
import { authClient } from '#/lib/auth-client'
import { userSessionsQueryOptions } from '#/lib/queries/admin'

function describeUserAgent(userAgent?: string | null) {
  if (!userAgent) return 'Unknown device'

  const browser = /edg\//i.test(userAgent)
    ? 'Edge'
    : /chrome\//i.test(userAgent)
      ? 'Chrome'
      : /firefox\//i.test(userAgent)
        ? 'Firefox'
        : /safari\//i.test(userAgent)
          ? 'Safari'
          : 'Unknown browser'

  const os = /windows/i.test(userAgent)
    ? 'Windows'
    : /mac os/i.test(userAgent)
      ? 'macOS'
      : /android/i.test(userAgent)
        ? 'Android'
        : /iphone|ipad/i.test(userAgent)
          ? 'iOS'
          : /linux/i.test(userAgent)
            ? 'Linux'
            : 'Unknown OS'

  return `${browser} on ${os}`
}

export default function UserSessionsCard({
  userId,
  currentSessionToken,
}: {
  userId: string
  currentSessionToken?: string
}) {
  const queryClient = useQueryClient()
  const {
    data: sessions,
    isLoading,
    isError,
  } = useQuery(userSessionsQueryOptions(userId))

  const [actionError, setActionError] = useState<string | null>(null)
  const [pendingToken, setPendingToken] = useState<string | null>(null)
  const [revokingAll, setRevokingAll] = useState(false)

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ['admin', 'users', userId, 'sessions'],
    })

  async function handleRevoke(sessionToken: string) {
    setActionError(null)
    setPendingToken(sessionToken)
    const { error } = await authClient.admin.revokeUserSession({
      sessionToken,
    })
    setPendingToken(null)

    if (error) {
      setActionError(error.message ?? 'Unable to revoke session')
      return
    }

    invalidate()
  }

  async function handleRevokeAll() {
    setActionError(null)
    setRevokingAll(true)
    const { error } = await authClient.admin.revokeUserSessions({ userId })
    setRevokingAll(false)

    if (error) {
      setActionError(error.message ?? 'Unable to revoke sessions')
      return
    }

    invalidate()
  }

  return (
    <Card withBorder radius="md" padding="lg">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Stack gap={2}>
            <Title order={4}>Sessions</Title>
            <Text c="dimmed" size="sm">
              Active sessions for this user across all devices.
            </Text>
          </Stack>

          {sessions && sessions.length > 0 && (
            <Button
              variant="light"
              color="red"
              size="xs"
              loading={revokingAll}
              onClick={handleRevokeAll}
            >
              Revoke all
            </Button>
          )}
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

        {isLoading && (
          <Stack gap="xs">
            <Skeleton height={36} />
            <Skeleton height={36} />
          </Stack>
        )}

        {isError && (
          <Text size="sm" c="dimmed">
            Unable to load sessions.
          </Text>
        )}

        {!isLoading && !isError && sessions && sessions.length === 0 && (
          <Text size="sm" c="dimmed">
            No active sessions.
          </Text>
        )}

        {!isLoading && !isError && sessions && sessions.length > 0 && (
          <Table.ScrollContainer minWidth={480}>
            <Table verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Device</Table.Th>
                  <Table.Th>IP address</Table.Th>
                  <Table.Th>Expires</Table.Th>
                  <Table.Th />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {sessions.map((session) => {
                  const isCurrent = session.token === currentSessionToken
                  return (
                    <Table.Tr key={session.id}>
                      <Table.Td>
                        <Group gap="xs" wrap="nowrap">
                          <IconDeviceDesktop
                            size={16}
                            className="text-[var(--mantine-color-dimmed)]"
                          />
                          <div>
                            <Text size="sm">
                              {describeUserAgent(session.userAgent)}
                            </Text>
                            {isCurrent && (
                              <Badge color="teal" variant="light" size="xs">
                                Current session
                              </Badge>
                            )}
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {session.ipAddress || 'Unknown'}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {new Date(session.expiresAt).toLocaleString()}
                        </Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Tooltip label="Revoke session">
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            loading={pendingToken === session.token}
                            onClick={() => handleRevoke(session.token)}
                          >
                            <IconX size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Table.Td>
                    </Table.Tr>
                  )
                })}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Stack>
    </Card>
  )
}
