import {
  Outlet,
  createFileRoute,
  redirect,
  useRouter,
} from '@tanstack/react-router'
import { AppShell, Button, Group, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconUserShield } from '@tabler/icons-react'
import { DashboardHeader } from '#/components/dashboard/dashboard-header'
import { Sidebar } from '#/components/dashboard/sidebar'
import { authClient } from '#/lib/auth-client'

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
})

function HomeLayout() {
  const { session } = Route.useRouteContext()
  const router = useRouter()
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] =
    useDisclosure()
  const [collapsed, { toggle: toggleCollapsed }] = useDisclosure(false)

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
              Viewing as {session.user.name}
            </Text>
            <Button
              size="xs"
              variant="white"
              onClick={async () => {
                await authClient.admin.stopImpersonating()
                await router.invalidate()
                await router.navigate({ to: '/admin' })
              }}
            >
              Stop impersonating
            </Button>
          </Group>
        )}
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
