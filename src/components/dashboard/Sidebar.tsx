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
  IconChartBar,
  IconChevronLeft,
  IconChevronRight,
  IconLayoutDashboard,
  IconPackage,
  IconReceipt2,
  IconSettings,
  IconShoppingBag,
  IconSpeakerphone,
  IconUsers,
  IconX,
} from '@tabler/icons-react'

type NavItem = {
  label: string
  icon: typeof IconLayoutDashboard
  to?: '/home'
  children?: Array<{ label: string }>
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: IconLayoutDashboard, to: '/home' },
  {
    label: 'Orders',
    icon: IconReceipt2,
    children: [
      { label: 'All orders' },
      { label: 'Drafts' },
      { label: 'Abandoned checkouts' },
    ],
  },
  {
    label: 'Products',
    icon: IconPackage,
    children: [
      { label: 'All products' },
      { label: 'Collections' },
      { label: 'Inventory' },
      { label: 'Categories' },
    ],
  },
  {
    label: 'Customers',
    icon: IconUsers,
    children: [{ label: 'All customers' }, { label: 'Segments' }],
  },
  {
    label: 'Marketing',
    icon: IconSpeakerphone,
    children: [{ label: 'Discounts' }, { label: 'Campaigns' }],
  },
  {
    label: 'Analytics',
    icon: IconChartBar,
    children: [{ label: 'Reports' }, { label: 'Live view' }],
  },
  {
    label: 'Settings',
    icon: IconSettings,
    children: [
      { label: 'General' },
      { label: 'Payments' },
      { label: 'Shipping' },
      { label: 'Team & permissions' },
      { label: 'Domains' },
    ],
  },
]

export default function Sidebar({
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
          to="/home"
          underline="never"
          c="inherit"
          onClick={onNavigate}
        >
          <Group gap={8} wrap="nowrap">
            <IconShoppingBag size={22} stroke={1.75} />
            {!collapsed && <Text fw={700}>Commerce</Text>}
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
            {navItems.map((item) =>
              item.to ? (
                <Tooltip
                  key={item.label}
                  label={item.label}
                  position="right"
                  withArrow
                >
                  <ActionIcon
                    component={Link}
                    to={item.to}
                    onClick={onNavigate}
                    variant={pathname === item.to ? 'light' : 'subtle'}
                    color={pathname === item.to ? 'blue' : 'gray'}
                    size={40}
                    radius="md"
                  >
                    <item.icon size={18} stroke={1.75} />
                  </ActionIcon>
                </Tooltip>
              ) : (
                <Tooltip
                  key={item.label}
                  label={item.label}
                  position="right"
                  withArrow
                >
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size={40}
                    radius="md"
                    disabled
                  >
                    <item.icon size={18} stroke={1.75} />
                  </ActionIcon>
                </Tooltip>
              ),
            )}
          </Stack>

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
      ) : (
        <Stack
          justify="space-between"
          p="md"
          style={{ flex: 1, overflow: 'auto' }}
        >
          <Stack gap={4}>
            {navItems.map((item) =>
              item.to ? (
                <NavLink
                  key={item.label}
                  component={Link}
                  to={item.to}
                  label={item.label}
                  leftSection={<item.icon size={18} stroke={1.75} />}
                  active={pathname === item.to}
                  variant="light"
                  onClick={onNavigate}
                />
              ) : (
                <NavLink
                  key={item.label}
                  label={item.label}
                  leftSection={<item.icon size={18} stroke={1.75} />}
                >
                  {item.children?.map((child) => (
                    <NavLink key={child.label} label={child.label} disabled />
                  ))}
                </NavLink>
              ),
            )}
          </Stack>

          <NavLink
            label="Collapse sidebar"
            leftSection={<IconChevronLeft size={18} stroke={1.75} />}
            onClick={onToggleCollapse}
            visibleFrom="sm"
          />
        </Stack>
      )}
    </Stack>
  )
}
