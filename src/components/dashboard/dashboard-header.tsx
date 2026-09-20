import { Link } from '@tanstack/react-router'
import {
  Avatar,
  Burger,
  Group,
  Menu,
  Text,
  UnstyledButton,
} from '@mantine/core'
import {
  IconChevronDown,
  IconLogout,
  IconShieldLock,
  IconUserCircle,
} from '@tabler/icons-react'
import { HeaderBreadcrumbs } from '#/components/dashboard/header-breadcrumbs'
import { ThemeToggle } from '#/components/theme-toggle'
import { signOut } from '#/lib/auth-client'
import type { Session } from '#/server/auth/auth'

export function DashboardHeader({
  session,
  navbarOpened,
  onBurgerClick,
}: {
  session: NonNullable<Session>
  navbarOpened: boolean
  onBurgerClick: () => void
}) {
  return (
    <Group h="100%" px="md" justify="space-between" wrap="nowrap">
      <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
        <Burger
          opened={navbarOpened}
          onClick={onBurgerClick}
          hiddenFrom="sm"
          size="sm"
        />
        <HeaderBreadcrumbs />
      </Group>

      <Group gap="xs" wrap="nowrap">
        <ThemeToggle />
        <Menu position="bottom-end" shadow="md" width={180}>
          <Menu.Target>
            <UnstyledButton className="rounded-md px-2 py-1 hover:bg-[var(--mantine-color-default-hover)]">
              <Group gap={8} wrap="nowrap">
                <Avatar
                  size={28}
                  radius="xl"
                  name={session.user.name}
                  color="initials"
                />
                <Text size="sm" fw={500} visibleFrom="xs">
                  {session.user.name}
                </Text>
                <IconChevronDown size={14} />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              component={Link}
              to="/home/profile"
              leftSection={<IconUserCircle size={16} />}
            >
              Profile
            </Menu.Item>
            {session.user.role === 'admin' && (
              <Menu.Item
                component={Link}
                to="/admin"
                leftSection={<IconShieldLock size={16} />}
              >
                Admin panel
              </Menu.Item>
            )}
            <Menu.Divider />
            <Menu.Item
              leftSection={<IconLogout size={16} />}
              onClick={() => signOut()}
            >
              Sign out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  )
}
