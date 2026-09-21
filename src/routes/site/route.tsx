import { Outlet, createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Header } from '#/components/header'
import { RouteError } from '#/components/layout/route-error'
import { SectionNotFound } from '#/components/layout/section-not-found'

export const Route = createFileRoute('/site')({
  component: SiteLayout,
  notFoundComponent: SiteNotFound,
  errorComponent: RouteError,
})

function SiteNotFound() {
  const { t } = useTranslation()

  return <SectionNotFound backTo="/" backLabel={t('nav.home')} />
}

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
