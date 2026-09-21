import { useMemo } from 'react'
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
  IconMailbox,
  IconMessageCircle,
  IconShieldLock,
  IconSpeakerphone,
  IconUsers,
  IconX,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

type AdminPath =
  | '/admin'
  | '/admin/users'
  | '/admin/announcements'
  | '/admin/feedback'
  | '/admin/contacts'

type NavLeaf = {
  label: string
  icon: typeof IconLayoutDashboard
  to: AdminPath
}

type NavItem =
  | NavLeaf
  | { label: string; icon: typeof IconLayoutDashboard; children: NavLeaf[] }

export function AdminSidebar({
  collapsed,
  onToggleCollapse,
  onNavigate,
}: {
  collapsed: boolean
  onToggleCollapse: () => void
  onNavigate?: () => void
}) {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const navItems: NavItem[] = useMemo(
    () => [
      {
        label: t('sidebar.overview'),
        icon: IconLayoutDashboard,
        to: '/admin',
      },
      { label: t('sidebar.users'), icon: IconUsers, to: '/admin/users' },
      {
        label: t('sidebar.communications'),
        icon: IconSpeakerphone,
        children: [
          {
            label: t('sidebar.announcements'),
            icon: IconBellRinging,
            to: '/admin/announcements',
          },
          {
            label: t('sidebar.feedback'),
            icon: IconMessageCircle,
            to: '/admin/feedback',
          },
          {
            label: t('sidebar.contactSubmissions'),
            icon: IconMailbox,
            to: '/admin/contacts',
          },
        ],
      },
    ],
    [t],
  )

  const collapsedItems: NavLeaf[] = navItems.flatMap((item) =>
    'children' in item ? item.children : [item],
  )

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
            {!collapsed && <Text fw={700}>{t('sidebar.brand')}</Text>}
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
            {collapsedItems.map((item) => (
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
            <Tooltip
              label={tCommon('sidebar.backToHome')}
              position="right"
              withArrow
            >
              <ActionIcon
                component={Link}
                to="/home"
                onClick={onNavigate}
                variant="subtle"
                color="gray"
                size={40}
                radius="md"
              >
                <IconArrowLeft size={18} stroke={1.75} className="icon-rtl-flip" />
              </ActionIcon>
            </Tooltip>

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
        </Stack>
      ) : (
        <Stack
          justify="space-between"
          p="md"
          style={{ flex: 1, overflow: 'auto' }}
        >
          <Stack gap={4}>
            {navItems.map((item) =>
              'children' in item ? (
                <NavLink
                  key={item.label}
                  label={item.label}
                  leftSection={<item.icon size={18} stroke={1.75} />}
                  defaultOpened={item.children.some(
                    (child) => child.to === pathname,
                  )}
                  rightSection={<IconChevronRight size={16} stroke={1.75} />}
                >
                  {item.children.map((child) => (
                    <NavLink
                      key={child.label}
                      component={Link}
                      to={child.to}
                      activeOptions={{ exact: true }}
                      label={child.label}
                      leftSection={<child.icon size={16} stroke={1.75} />}
                      active={pathname === child.to}
                      variant="light"
                      onClick={onNavigate}
                    />
                  ))}
                </NavLink>
              ) : (
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
              ),
            )}
          </Stack>

          <Stack gap={4}>
            <NavLink
              component={Link}
              to="/home"
              label={tCommon('sidebar.backToHome')}
              leftSection={
                <IconArrowLeft size={18} stroke={1.75} className="icon-rtl-flip" />
              }
              onClick={onNavigate}
            />
            <NavLink
              label={tCommon('sidebar.collapse')}
              leftSection={
                <IconChevronLeft size={18} stroke={1.75} className="icon-rtl-flip" />
              }
              onClick={onToggleCollapse}
              visibleFrom="sm"
            />
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}
