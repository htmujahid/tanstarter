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
  IconNotes,
  IconRocket,
  IconSettings,
  IconX,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

type NavItem = {
  label: string
  icon: typeof IconLayoutDashboard
  to?: '/home' | '/home/notes'
  children?: Array<{ label: string }>
}

function useNavItems(): NavItem[] {
  const { t } = useTranslation('home')

  return [
    { label: t('sidebar.dashboard'), icon: IconLayoutDashboard, to: '/home' },
    { label: t('sidebar.notes'), icon: IconNotes, to: '/home/notes' },
    {
      label: t('sidebar.analytics.label'),
      icon: IconChartBar,
      children: [
        { label: t('sidebar.analytics.reports') },
        { label: t('sidebar.analytics.liveView') },
      ],
    },
    {
      label: t('sidebar.settings.label'),
      icon: IconSettings,
      children: [
        { label: t('sidebar.settings.general') },
        { label: t('sidebar.settings.notifications') },
        { label: t('sidebar.settings.security') },
        { label: t('sidebar.settings.members') },
      ],
    },
  ]
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  onNavigate,
}: {
  collapsed: boolean
  onToggleCollapse: () => void
  onNavigate?: () => void
}) {
  const { t: tCommon } = useTranslation('common')
  const navItems = useNavItems()
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
            <IconRocket size={22} stroke={1.75} />
            {!collapsed && <Text fw={700}>{tCommon('app.name')}</Text>}
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
            aria-label={tCommon('sidebar.close')}
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

          <Tooltip
            label={tCommon('sidebar.expand')}
            position="right"
            withArrow
          >
            <ActionIcon
              variant="subtle"
              color="gray"
              size={36}
              radius="md"
              onClick={onToggleCollapse}
            >
              <IconChevronRight size={18} stroke={1.75} className="icon-rtl-flip" />
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
                  activeOptions={{ exact: true }}
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
                  rightSection={<IconChevronRight size={16} stroke={1.75} />}
                >
                  {item.children?.map((child) => (
                    <NavLink key={child.label} label={child.label} disabled />
                  ))}
                </NavLink>
              ),
            )}
          </Stack>

          <NavLink
            label={tCommon('sidebar.collapse')}
            leftSection={
              <IconChevronLeft size={18} stroke={1.75} className="icon-rtl-flip" />
            }
            onClick={onToggleCollapse}
            visibleFrom="sm"
          />
        </Stack>
      )}
    </Stack>
  )
}
