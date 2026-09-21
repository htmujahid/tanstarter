import {
  Outlet,
  createFileRoute,
  redirect,
  useRouter,
} from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { AppShell, Button, Group, Text } from '@mantine/core'
import { useDisclosure, useLocalStorage } from '@mantine/hooks'
import { IconUserShield } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { DashboardHeader } from '#/components/dashboard/dashboard-header'
import { Sidebar } from '#/components/dashboard/sidebar'
import { RouteError } from '#/components/layout/route-error'
import { SectionNotFound } from '#/components/layout/section-not-found'
import { authClient } from '#/lib/auth-client'
import { CURRENT_SESSION_QUERY_KEY } from '#/lib/queries/session'

const NAVBAR_WIDTH_EXPANDED = 260
const NAVBAR_WIDTH_COLLAPSED = 80

export const Route = createFileRoute('/home')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/auth/sign-in' })
    }

    return { session: context.session }
  },
  staticData: { breadcrumb: 'Home' },
  component: HomeLayout,
  notFoundComponent: HomeNotFound,
  errorComponent: RouteError,
})

function HomeNotFound() {
  const { t } = useTranslation('home')

  return (
    <SectionNotFound backTo="/home" backLabel={t('sidebar.dashboard')} />
  )
}

function HomeLayout() {
  const { t } = useTranslation()
  const { session } = Route.useRouteContext()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] =
    useDisclosure()
  const [collapsed, setCollapsed] = useLocalStorage({
    key: 'home-sidebar-collapsed',
    defaultValue: false,
  })
  const toggleCollapsed = () => setCollapsed((value) => !value)

  const impersonatedBy = session.session.impersonatedBy

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      navbar={{
        width: collapsed ? NAVBAR_WIDTH_COLLAPSED : NAVBAR_WIDTH_EXPANDED,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <DashboardHeader
          session={session}
          navbarOpened={mobileOpened}
          onBurgerClick={toggleMobile}
        />
      </AppShell.Header>

      <AppShell.Navbar>
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={toggleCollapsed}
          onNavigate={closeMobile}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        {impersonatedBy && (
          <Group
            justify="center"
            gap="xs"
            py={6}
            mb="md"
            className="rounded-md bg-[var(--mantine-color-yellow-1)]"
          >
            <IconUserShield size={16} />
            <Text size="sm" fw={500}>
              {t('impersonation.viewingAs', { name: session.user.name })}
            </Text>
            <Button
              size="xs"
              variant="white"
              onClick={async () => {
                await authClient.admin.stopImpersonating()
                await queryClient.invalidateQueries({
                  queryKey: CURRENT_SESSION_QUERY_KEY,
                })
                await router.invalidate()
                await router.navigate({ to: '/admin' })
              }}
            >
              {t('actions.stopImpersonating')}
            </Button>
          </Group>
        )}
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
