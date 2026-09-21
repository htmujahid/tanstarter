import { useState } from 'react'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  ColorSchemeScript,
  DirectionProvider,
  MantineProvider,
  mantineHtmlProps,
} from '@mantine/core'
import { I18nextProvider, useTranslation } from 'react-i18next'

import mantineCss from '@mantine/core/styles.css?url'
import appCss from '../styles.css?url'
import { theme } from '../theme'
import { getLocaleFn } from '#/server/actions/locale'
import { currentSessionQueryOptions } from '#/lib/queries/session'
import { createI18nInstance } from '#/lib/i18n/create-instance'
import { isRtl } from '#/lib/i18n/config'
import type { QueryClient } from '@tanstack/react-query'
import type { DbClient } from '@tanstack/react-db'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  dbClient: DbClient
}>()(
  {
    beforeLoad: async ({ context }) => {
      const [session, locale] = await Promise.all([
        context.queryClient.query({
          ...currentSessionQueryOptions(),
          staleTime: 'static',
        }),
        getLocaleFn(),
      ])
      return { session, locale }
    },
    head: () => ({
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          title: 'Commerce | Sell online without the overhead',
        },
        {
          name: 'description',
          content:
            'Launch a fast, secure storefront your customers will love. Built to get out of your way, so you can focus on selling.',
        },
        {
          name: 'theme-color',
          content: '#228be6',
        },
      ],
      links: [
        {
          rel: 'stylesheet',
          href: mantineCss,
        },
        {
          rel: 'stylesheet',
          href: appCss,
        },
      ],
    }),
    shellComponent: RootDocument,
    notFoundComponent: NotFound,
  },
)

function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 text-center">
      <h1 className="text-2xl font-semibold">{t('notFound.title')}</h1>
      <p className="text-muted-foreground">{t('notFound.description')}</p>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { locale } = Route.useRouteContext()
  const [i18n] = useState(() => createI18nInstance(locale))
  const dir = isRtl(locale) ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <I18nextProvider i18n={i18n}>
          <DirectionProvider initialDirection={dir}>
            <MantineProvider theme={theme} defaultColorScheme="auto">
              {children}
              <TanStackDevtools
                config={{
                  position: 'bottom-right',
                }}
                plugins={[
                  {
                    name: 'Tanstack Router',
                    render: <TanStackRouterDevtoolsPanel />,
                  },
                  {
                    name: 'Tanstack Query',
                    render: <ReactQueryDevtoolsPanel />,
                  },
                ]}
              />
            </MantineProvider>
          </DirectionProvider>
        </I18nextProvider>
        <Scripts />
      </body>
    </html>
  )
}
