import { Link, useRouterState } from '@tanstack/react-router'
import {
  ActionIcon,
  Anchor,
  Group,
  NavLink,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core'
import {
  IconArrowLeft,
  IconBellRinging,
  IconChevronLeft,
  IconChevronRight,
  IconLayoutDashboard,
  IconMessageCircle,
  IconShieldLock,
  IconUsers,
  IconX,
} from '@tabler/icons-react'

const navItems = [
  { label: 'Overview', icon: IconLayoutDashboard, to: '/admin' as const },
  { label: 'Users', icon: IconUsers, to: '/admin/users' as const },
  {
    label: 'Announcements',
    icon: IconBellRinging,
    to: '/admin/announcements' as const,
  },
  {
    label: 'Feedback',
    icon: IconMessageCircle,
    to: '/admin/feedback' as const,
  },
]

export function AdminSidebar({
  collapsed,
  onToggleCollapse,
  onNavigate,
}: {
  collapsed: boolean
  onToggleCollapse: () => void
  onNavigate?: () => void
}) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <Stack h="100%" gap={0}>
      <Group
        h={60}
        px={collapsed ? 'xs' : 'md'}
        justify={collapsed ? 'center' : 'space-between'}
        wrap="nowrap"
        className="border-b border-[var(--mantine-color-default-border)]"
      >
        <Anchor
          component={Link}
          to="/admin"
          underline="never"
          c="inherit"
          onClick={onNavigate}
        >
          <Group gap={8} wrap="nowrap">
            <IconShieldLock size={22} stroke={1.75} />
            {!collapsed && <Text fw={700}>Admin</Text>}
          </Group>
        </Anchor>

        {!collapsed && (
          <ActionIcon
            variant="subtle"
            color="gray"
            size={32}
            radius="md"
            hiddenFrom="sm"
            onClick={onNavigate}
            aria-label="Close sidebar"
          >
            <IconX size={18} stroke={1.75} />
          </ActionIcon>
        )}
      </Group>

      {collapsed ? (
        <Stack
          justify="space-between"
          align="center"
          p="xs"
          style={{ flex: 1, overflow: 'auto' }}
        >
          <Stack gap={4} align="center">
            {navItems.map((item) => (
              <Tooltip
                key={item.label}
                label={item.label}
                position="right"
                withArrow
              >
                <ActionIcon
                  component={Link}
                  to={item.to}
                  activeOptions={{ exact: true }}
                  onClick={onNavigate}
                  variant={pathname === item.to ? 'light' : 'subtle'}
                  color={pathname === item.to ? 'blue' : 'gray'}
                  size={40}
                  radius="md"
                >
                  <item.icon size={18} stroke={1.75} />
                </ActionIcon>
              </Tooltip>
            ))}
          </Stack>

          <Stack gap={4} align="center">
            <Tooltip label="Back to store" position="right" withArrow>
              <ActionIcon
                component={Link}
                to="/home"
                onClick={onNavigate}
                variant="subtle"
                color="gray"
                size={40}
                radius="md"
              >
                <IconArrowLeft size={18} stroke={1.75} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Expand sidebar" position="right" withArrow>
              <ActionIcon
                variant="subtle"
                color="gray"
                size={36}
                radius="md"
                onClick={onToggleCollapse}
              >
                <IconChevronRight size={18} stroke={1.75} />
              </ActionIcon>
            </Tooltip>
          </Stack>
        </Stack>
      ) : (
        <Stack
          justify="space-between"
          p="md"
          style={{ flex: 1, overflow: 'auto' }}
        >
          <Stack gap={4}>
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                component={Link}
                to={item.to}
                activeOptions={{ exact: true }}
                label={item.label}
                leftSection={<item.icon size={18} stroke={1.75} />}
                active={pathname === item.to}
                variant="light"
                onClick={onNavigate}
              />
            ))}
          </Stack>

          <Stack gap={4}>
            <NavLink
              component={Link}
              to="/home"
              label="Back to store"
              leftSection={<IconArrowLeft size={18} stroke={1.75} />}
              onClick={onNavigate}
            />
            <NavLink
              label="Collapse sidebar"
              leftSection={<IconChevronLeft size={18} stroke={1.75} />}
              onClick={onToggleCollapse}
              visibleFrom="sm"
            />
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}
