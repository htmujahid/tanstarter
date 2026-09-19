import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import Header from '#/components/Header'

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
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <Outlet />
    </div>
  )
}
