import { Link, useRouter } from '@tanstack/react-router'
import { Anchor, Avatar, Button, Group, Menu, Text } from '@mantine/core'
import {
  IconChevronDown,
  IconLogout,
  IconShoppingBag,
} from '@tabler/icons-react'
import { ThemeToggle } from '#/components/theme-toggle'
import { signOut } from '#/lib/auth-client'
import { useSession } from '#/hooks/use-session'

export function Header() {
  const router = useRouter()
  const session = useSession()

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

          {session ? (
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
                  onClick={async () => {
                    await signOut()
                    await router.invalidate()
                  }}
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
