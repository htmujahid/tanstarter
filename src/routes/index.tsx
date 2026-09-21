import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Anchor,
  Badge,
  Button,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  IconArrowRight,
  IconBellRinging,
  IconMail,
  IconSparkles,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { Header } from '#/components/header'
import { features } from '#/lib/features'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { t } = useTranslation('site')
  const { t: tCommon } = useTranslation('common')

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Header />

      <main className="relative flex flex-1 items-center justify-center overflow-x-hidden overflow-y-auto px-6 py-6">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div className="bg-grid-pattern absolute inset-0" />
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
          <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl" />
        </div>

        <Stack gap="lg" align="center" maw={760} className="relative">
          <Badge
            size="lg"
            radius="sm"
            variant="light"
            color="blue"
            leftSection={<IconSparkles size={14} />}
          >
            {t('landing.badge')}
          </Badge>

          <Stack gap="sm" align="center" ta="center">
            <Title
              order={1}
              className="text-3xl leading-tight sm:text-4xl lg:text-5xl"
            >
              {t('landing.heroTitle')}{' '}
              <Text
                span
                inherit
                className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
              >
                {t('landing.heroHighlight')}
              </Text>
            </Title>
            <Text size="lg" c="dimmed" maw={560}>
              {t('landing.subtitle')}
            </Text>
          </Stack>

          <Group gap="sm">
            <Button
              component={Link}
              to="/auth/setup"
              size="md"
              rightSection={
                <IconArrowRight size={18} className="icon-rtl-flip" />
              }
            >
              {tCommon('actions.getStarted')}
            </Button>
            <Button component={Link} to="/help" size="md" variant="default">
              {t('landing.getHelp')}
            </Button>
          </Group>

          <Group gap="lg" justify="center">
            <Anchor
              component={Link}
              to="/site/announcements"
              size="sm"
              c="dimmed"
              underline="hover"
            >
              <Group gap={6} wrap="nowrap">
                <IconBellRinging size={14} />
                {t('landing.announcementsLink')}
              </Group>
            </Anchor>
            <Anchor
              component={Link}
              to="/site/contact"
              size="sm"
              c="dimmed"
              underline="hover"
            >
              <Group gap={6} wrap="nowrap">
                <IconMail size={14} />
                {t('landing.contactLink')}
              </Group>
            </Anchor>
          </Group>

          <Group gap="lg" justify="center" wrap="wrap" className="pt-2">
            {features.map((feature) => (
              <Group
                key={feature.id}
                gap="sm"
                wrap="nowrap"
                align="flex-start"
                w={220}
              >
                <ThemeIcon variant="light" color="blue" size={36} radius="md">
                  <feature.icon size={18} stroke={1.75} />
                </ThemeIcon>
                <Stack gap={2}>
                  <Text fw={600} size="sm">
                    {tCommon(`features.${feature.id}.title`)}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {tCommon(`features.${feature.id}.description`)}
                  </Text>
                </Stack>
              </Group>
            ))}
          </Group>
        </Stack>
      </main>
    </div>
  )
}
