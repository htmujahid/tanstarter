import { Link } from '@tanstack/react-router'
import {
  Anchor,
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
  IconShoppingBag,
  IconUserCircle,
} from '@tabler/icons-react'
import ThemeToggle from '#/components/ThemeToggle'
import { signOut } from '#/lib/auth-client'
import type { Session } from '#/server/auth/auth'

export default function DashboardHeader({
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
      <Group gap="sm" wrap="nowrap">
        <Burger
          opened={navbarOpened}
          onClick={onBurgerClick}
          hiddenFrom="sm"
          size="sm"
        />
        <Anchor component={Link} to="/home" underline="never" c="inherit">
          <Group gap={8} wrap="nowrap">
            <IconShoppingBag size={22} stroke={1.75} />
            <Text fw={700}>Commerce</Text>
          </Group>
        </Anchor>
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
