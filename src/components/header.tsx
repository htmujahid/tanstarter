import { Link, useRouter } from '@tanstack/react-router'
import { Anchor, Avatar, Button, Group, Menu, Text } from '@mantine/core'
import {
  IconHome,
  IconLogout,
  IconShieldLock,
  IconShoppingBag,
  IconUserCircle,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { ThemeToggle } from '#/components/theme-toggle'
import { LocaleToggle } from '#/components/locale-toggle'
import { signOut } from '#/lib/auth-client'
import { useSession } from '#/hooks/use-session'

export function Header() {
  const { t } = useTranslation()
  const router = useRouter()
  const session = useSession()

  return (
    <header className="border-b border-[var(--mantine-color-default-border)]">
      <Group justify="space-between" px="md" py="sm" wrap="nowrap">
        <Anchor component={Link} to="/" underline="never" c="inherit">
          <Group gap={8} wrap="nowrap">
            <IconShoppingBag size={24} stroke={1.75} />
            <Text fw={700} size="lg">
              {t('app.name')}
            </Text>
          </Group>
        </Anchor>

        <Group gap="xs" wrap="nowrap">
          <LocaleToggle />
          <ThemeToggle />

          {session ? (
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
                    await router.invalidate()
                  }}
                >
                  {t('actions.signOut')}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Button component={Link} to="/auth/setup">
              {t('actions.getStarted')}
            </Button>
          )}
        </Group>
      </Group>
    </header>
  )
}
