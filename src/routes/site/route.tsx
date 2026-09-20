import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Header } from '#/components/header'

export const Route = createFileRoute('/site')({
  component: SiteLayout,
})

function SiteLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1 px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
