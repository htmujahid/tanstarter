import { Link, useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Avatar, Burger, Group, Menu, Text } from '@mantine/core'
import {
  IconHome,
  IconKey,
  IconLogout,
  IconShieldLock,
  IconUserCircle,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { HeaderBreadcrumbs } from '#/components/dashboard/header-breadcrumbs'
import { OfflineStatusBadge } from '#/components/dashboard/offline-status-badge'
import { ThemeToggle } from '#/components/theme-toggle'
import { LocaleToggle } from '#/components/locale-toggle'
import { signOut } from '#/lib/auth-client'
import { CURRENT_SESSION_QUERY_KEY } from '#/lib/queries/session'
import type { Session } from '#/server/auth/auth'

export function DashboardHeader({
  session,
  navbarOpened,
  onBurgerClick,
}: {
  session: NonNullable<Session>
  navbarOpened?: boolean
  onBurgerClick?: () => void
}) {
  const { t } = useTranslation()
  const router = useRouter()
  const queryClient = useQueryClient()

  return (
    <Group h="100%" px="md" justify="space-between" wrap="nowrap">
      <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
        {onBurgerClick && (
          <Burger
            opened={navbarOpened}
            onClick={onBurgerClick}
            hiddenFrom="sm"
            size="sm"
          />
        )}
        <HeaderBreadcrumbs />
      </Group>

      <Group gap="xs" wrap="nowrap">
        <OfflineStatusBadge />
        <LocaleToggle />
        <ThemeToggle />
        <Menu position="bottom-end" shadow="md" width={240}>
          <Menu.Target>
            <Avatar
              size={32}
              radius="xl"
              name={session.user.name}
              color="initials"
              style={{ cursor: 'pointer' }}
            />
          </Menu.Target>
          <Menu.Dropdown>
            <div className="px-3 py-2">
              <Text size="sm" fw={500} truncate>
                {session.user.name}
              </Text>
              <Text size="xs" c="dimmed" truncate>
                {session.user.email}
              </Text>
            </div>
            <Menu.Divider />
            <Menu.Item
              component={Link}
              to="/home"
              leftSection={<IconHome size={16} />}
            >
              {t('nav.home')}
            </Menu.Item>
            <Menu.Item
              component={Link}
              to="/home/profile"
              leftSection={<IconUserCircle size={16} />}
            >
              {t('nav.profile')}
            </Menu.Item>
            <Menu.Item
              component={Link}
              to="/home/api-keys"
              leftSection={<IconKey size={16} />}
            >
              {t('nav.apiKeys')}
            </Menu.Item>
            {session.user.role === 'admin' && (
              <Menu.Item
                component={Link}
                to="/admin"
                leftSection={<IconShieldLock size={16} />}
              >
                {t('nav.adminPanel')}
              </Menu.Item>
            )}
            <Menu.Divider />
            <Menu.Item
              leftSection={<IconLogout size={16} />}
              onClick={async () => {
                await signOut()
                await queryClient.invalidateQueries({
                  queryKey: CURRENT_SESSION_QUERY_KEY,
                })
                await router.invalidate()
              }}
            >
              {t('actions.signOut')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  )
}
