import { useState } from 'react'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import { IconAlertCircle, IconDeviceDesktop, IconX } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { authClient } from '#/lib/auth-client'
import { formatDateTime } from '#/lib/format-date'
import { userSessionsQueryOptions } from '#/lib/queries/admin.query'

function describeUserAgent(
  t: TFunction<'admin'>,
  userAgent?: string | null,
) {
  if (!userAgent) return t('users.detail.sessions.unknownDevice')

  const browser = /edg\//i.test(userAgent)
    ? 'Edge'
    : /chrome\//i.test(userAgent)
      ? 'Chrome'
      : /firefox\//i.test(userAgent)
        ? 'Firefox'
        : /safari\//i.test(userAgent)
          ? 'Safari'
          : t('users.detail.sessions.unknownBrowser')

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
            : t('users.detail.sessions.unknownOs')

  return t('users.detail.sessions.deviceTemplate', { browser, os })
}

export function UserSessionsCard({
  userId,
  currentSessionToken,
}: {
  userId: string
  currentSessionToken?: string
}) {
  const { t } = useTranslation('admin')
  const queryClient = useQueryClient()
  const { data: sessions } = useSuspenseQuery(userSessionsQueryOptions(userId))

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
      setActionError(error.message ?? t('users.detail.sessions.genericRevokeError'))
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
      setActionError(
        error.message ?? t('users.detail.sessions.genericRevokeAllError'),
      )
      return
    }

    invalidate()
  }

  return (
    <Card withBorder radius="md" padding="lg">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Stack gap={2}>
            <Title order={4}>{t('users.detail.sessions.title')}</Title>
            <Text c="dimmed" size="sm">
              {t('users.detail.sessions.description')}
            </Text>
          </Stack>

          {sessions.length > 0 && (
            <Button
              variant="light"
              color="red"
              size="xs"
              loading={revokingAll}
              onClick={handleRevokeAll}
            >
              {t('users.detail.sessions.revokeAllButton')}
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

        {sessions.length === 0 ? (
          <Text size="sm" c="dimmed">
            {t('users.detail.sessions.emptyState')}
          </Text>
        ) : (
          <Table.ScrollContainer minWidth={480}>
            <Table verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t('users.detail.sessions.deviceColumn')}</Table.Th>
                  <Table.Th>{t('users.detail.sessions.ipColumn')}</Table.Th>
                  <Table.Th>{t('users.detail.sessions.expiresColumn')}</Table.Th>
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
                              {describeUserAgent(t, session.userAgent)}
                            </Text>
                            {isCurrent && (
                              <Badge color="teal" variant="light" size="xs">
                                {t('users.detail.sessions.currentBadge')}
                              </Badge>
                            )}
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {session.ipAddress || t('users.detail.sessions.unknownIp')}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {formatDateTime(session.expiresAt)}
                        </Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Tooltip label={t('users.detail.sessions.revokeTooltip')}>
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
