import { Link, Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { Group, Stack, Text, Title } from '@mantine/core'
import { IconShoppingBag } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { features } from '#/lib/features'
import { RouteError } from '#/components/layout/route-error'

export const Route = createFileRoute('/auth')({
  beforeLoad: ({ context }) => {
    if (context.session) {
      throw redirect({ to: '/home' })
    }
  },
  component: AuthLayout,
  errorComponent: RouteError,
})

function AuthLayout() {
  const { t } = useTranslation('auth')
  const { t: tCommon } = useTranslation('common')

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-700 to-cyan-600 p-10 text-white lg:flex">
        <div
          className="bg-grid-pattern-light pointer-events-none absolute inset-0"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />

        <Link to="/" className="relative inline-flex w-fit items-center gap-2">
          <IconShoppingBag size={28} stroke={1.5} />
          <Text fw={700} size="lg" c="white">
            {tCommon('app.name')}
          </Text>
        </Link>

        <Stack gap="xl" className="relative max-w-md">
          <Stack gap={4}>
            <Title order={2} c="white">
              {t('layout.title')}
            </Title>
            <Text c="gray.2">{t('layout.subtitle')}</Text>
          </Stack>

          <Stack gap="md">
            {features.map((feature) => (
              <Group
                key={feature.id}
                gap="sm"
                wrap="nowrap"
                align="flex-start"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/15">
                  <feature.icon size={18} stroke={1.75} />
                </div>
                <Stack gap={0}>
                  <Text fw={600} size="sm" c="white">
                    {tCommon(`features.${feature.id}.title`)}
                  </Text>
                  <Text size="xs" c="gray.3">
                    {tCommon(`features.${feature.id}.description`)}
                  </Text>
                </Stack>
              </Group>
            ))}
          </Stack>
        </Stack>

        <Text size="sm" c="gray.3" className="relative">
          {t('layout.copyright', { year: new Date().getFullYear() })}
        </Text>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <IconShoppingBag size={24} stroke={1.75} />
            <Text fw={700} size="lg">
              {tCommon('app.name')}
            </Text>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  )
}
