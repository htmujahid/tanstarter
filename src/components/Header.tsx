import { Link } from '@tanstack/react-router'
import {
  Anchor,
  Avatar,
  Button,
  Group,
  Menu,
  Skeleton,
  Text,
} from '@mantine/core'
import {
  IconChevronDown,
  IconLogout,
  IconShoppingBag,
} from '@tabler/icons-react'
import ThemeToggle from '#/components/ThemeToggle'
import { signOut, useSession } from '#/lib/auth-client'

export default function Header() {
  const { data: session, isPending } = useSession()

  return (
    <header className="border-b border-[var(--mantine-color-default-border)]">
      <Group justify="space-between" px="md" py="sm" wrap="nowrap">
        <Anchor component={Link} to="/" underline="never" c="inherit">
          <Group gap={8} wrap="nowrap">
            <IconShoppingBag size={24} stroke={1.75} />
            <Text fw={700} size="lg">
              Commerce
            </Text>
          </Group>
        </Anchor>

        <Group gap="xs" wrap="nowrap">
          <ThemeToggle />

          {isPending ? (
            <Skeleton height={36} width={92} radius="sm" />
          ) : session ? (
            <Menu position="bottom-end" shadow="md" width={180}>
              <Menu.Target>
                <Button
                  variant="subtle"
                  rightSection={<IconChevronDown size={16} />}
                >
                  <Group gap={8} wrap="nowrap">
                    <Avatar
                      size={24}
                      radius="xl"
                      name={session.user.name}
                      color="initials"
                    />
                    {session.user.name}
                  </Group>
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconLogout size={16} />}
                  onClick={() => signOut()}
                >
                  Sign out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Button component={Link} to="/auth/setup">
              Get started
            </Button>
          )}
        </Group>
      </Group>
    </header>
  )
}
