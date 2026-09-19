import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import DashboardHeader from '#/components/dashboard/DashboardHeader'
import Sidebar from '#/components/dashboard/Sidebar'

const NAVBAR_WIDTH_EXPANDED = 260
const NAVBAR_WIDTH_COLLAPSED = 80

export const Route = createFileRoute('/home')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/auth/sign-in' })
    }

    return { session: context.session }
  },
  component: HomeLayout,
})

function HomeLayout() {
  const { session } = Route.useRouteContext()
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] =
    useDisclosure()
  const [collapsed, { toggle: toggleCollapsed }] = useDisclosure(false)

  return (
    <AppShell
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

      <AppShell.Navbar p={collapsed ? 'xs' : 'md'}>
        <Sidebar
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
