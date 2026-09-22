import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/site/feedback')({
  beforeLoad: ({ context, location }) => {
    if (!context.session) {
      throw redirect({
        to: '/auth/sign-in',
        search: { redirect: location.href },
      })
    }

    return { session: context.session }
  },
  component: () => <Outlet />,
})
