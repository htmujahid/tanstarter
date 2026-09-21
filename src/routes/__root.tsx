import { useState } from 'react'
import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  Button,
  Card,
  ColorSchemeScript,
  Container,
  DirectionProvider,
  MantineProvider,
  Stack,
  Text,
  Title,
  mantineHtmlProps,
} from '@mantine/core'
import { IconError404 } from '@tabler/icons-react'
import { I18nextProvider, useTranslation } from 'react-i18next'

import mantineCss from '@mantine/core/styles.css?url'
import appCss from '../styles.css?url'
import { theme } from '../theme'
import { getLocaleFn } from '#/server/actions/locale.action'
import { currentSessionQueryOptions } from '#/lib/queries/session.query'
import { createI18nInstance } from '#/lib/i18n/create-instance'
import { isRtl } from '#/lib/i18n/config'
import { RouteError } from '#/components/layout/route-error'
import { RegisterServiceWorker } from '#/components/pwa/register-service-worker'
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
          title: 'Starter Kit | A batteries-included TanStack Start admin panel',
        },
        {
          name: 'description',
          content:
            'A production-ready starter kit for TanStack Start — authentication, role-based permissions, offline-first data, and a Cloudflare-native API, ready to build on.',
        },
        {
          name: 'theme-color',
          content: '#228be6',
        },
        {
          name: 'application-name',
          content: 'Starter Kit',
        },
        {
          name: 'apple-mobile-web-app-title',
          content: 'Starter Kit',
        },
        {
          name: 'apple-mobile-web-app-capable',
          content: 'yes',
        },
        {
          name: 'mobile-web-app-capable',
          content: 'yes',
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
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        {
          rel: 'manifest',
          href: '/site.webmanifest',
        },
      ],
    }),
    shellComponent: RootDocument,
    notFoundComponent: NotFound,
    errorComponent: RouteError,
    onCatch: (error) => {
      console.error(error)
    },
  },
)

function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <Container size="xs" px={0}>
        <Card withBorder radius="md" padding="xl">
          <Stack align="center" gap="xs" py="md">
            <IconError404
              size={32}
              className="text-[var(--mantine-color-dimmed)]"
            />
            <Title order={4}>{t('notFound.title')}</Title>
            <Text c="dimmed" size="sm" ta="center">
              {t('notFound.description')}
            </Text>
            <Button component={Link} to="/" variant="light" mt="sm">
              {t('nav.home')}
            </Button>
          </Stack>
        </Card>
      </Container>
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
        <RegisterServiceWorker />
        <Scripts />
      </body>
    </html>
  )
}
