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
import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { authClient } from '#/lib/auth-client'
import { formatDateTime } from '#/lib/format-date'
import { sessionsQueryOptions } from '#/lib/queries/session'

function describeUserAgent(
  t: TFunction<'profile'>,
  userAgent?: string | null,
) {
  if (!userAgent) return t('sessions.unknownDevice')

  const browser = /edg\//i.test(userAgent)
    ? 'Edge'
    : /chrome\//i.test(userAgent)
      ? 'Chrome'
      : /firefox\//i.test(userAgent)
        ? 'Firefox'
        : /safari\//i.test(userAgent)
          ? 'Safari'
          : t('sessions.unknownBrowser')

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
            : t('sessions.unknownOs')

  return t('sessions.deviceOn', { browser, os })
}

export function SessionsList({
  currentSessionToken,
}: {
  currentSessionToken?: string
}) {
  const { t } = useTranslation('profile')
  const queryClient = useQueryClient()
  const { data: sessions } = useSuspenseQuery(sessionsQueryOptions())

  const [actionError, setActionError] = useState<string | null>(null)
  const [pendingToken, setPendingToken] = useState<string | null>(null)
  const [revokingOthers, setRevokingOthers] = useState(false)

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['session', 'list'] })

  async function handleRevoke(token: string) {
    setActionError(null)
    setPendingToken(token)
    const { error } = await authClient.revokeSession({ token })
    setPendingToken(null)

    if (error) {
      setActionError(error.message ?? t('sessions.revokeError'))
      return
    }

    invalidate()
  }

  async function handleRevokeOthers() {
    setActionError(null)
    setRevokingOthers(true)
    const { error } = await authClient.revokeOtherSessions()
    setRevokingOthers(false)

    if (error) {
      setActionError(error.message ?? t('sessions.revokeOthersError'))
      return
    }

    invalidate()
  }

  const otherSessionsCount = sessions.filter(
    (session) => session.token !== currentSessionToken,
  ).length

  return (
    <Card withBorder radius="md" padding="lg">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Stack gap={2}>
            <Title order={3}>{t('sessions.title')}</Title>
            <Text c="dimmed" size="sm">
              {t('sessions.subtitle')}
            </Text>
          </Stack>

          {otherSessionsCount > 0 && (
            <Button
              variant="light"
              color="red"
              size="xs"
              loading={revokingOthers}
              onClick={handleRevokeOthers}
            >
              {t('sessions.signOutOthers')}
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
            {t('sessions.emptyState')}
          </Text>
        ) : (
          <Table.ScrollContainer minWidth={480}>
            <Table verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t('sessions.deviceColumn')}</Table.Th>
                  <Table.Th>{t('sessions.ipColumn')}</Table.Th>
                  <Table.Th>{t('sessions.expiresColumn')}</Table.Th>
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
                                {t('sessions.currentSession')}
                              </Badge>
                            )}
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {session.ipAddress || t('sessions.unknownIp')}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {formatDateTime(session.expiresAt)}
                        </Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        {!isCurrent && (
                          <Tooltip label={t('sessions.revokeTooltip')}>
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              loading={pendingToken === session.token}
                              onClick={() => handleRevoke(session.token)}
                            >
                              <IconX size={16} />
                            </ActionIcon>
                          </Tooltip>
                        )}
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
