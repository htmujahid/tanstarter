import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { AdminSidebar } from '#/components/admin/admin-sidebar'
import { DashboardHeader } from '#/components/dashboard/dashboard-header'

const NAVBAR_WIDTH_EXPANDED = 260
const NAVBAR_WIDTH_COLLAPSED = 80

export const Route = createFileRoute('/admin')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/auth/sign-in' })
    }

    if (context.session.user.role !== 'admin') {
      throw redirect({ to: '/home' })
    }

    return { session: context.session }
  },
  staticData: { breadcrumb: 'Admin' },
  component: AdminLayout,
})

function AdminLayout() {
  const { session } = Route.useRouteContext()
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] =
    useDisclosure()
  const [collapsed, { toggle: toggleCollapsed }] = useDisclosure(false)

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
        <AdminSidebar
          collapsed={collapsed}
          onToggleCollapse={toggleCollapsed}
          onNavigate={closeMobile}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
