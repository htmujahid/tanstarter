import { Link, createFileRoute } from '@tanstack/react-router'
import { Accordion, Anchor, Container, Stack, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { Header } from '#/components/header'

export const Route = createFileRoute('/help')({ component: Help })

function Help() {
  const { t } = useTranslation('site')
  const faqs = t('help.faqs', { returnObjects: true })

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <Container size="sm" className="w-full flex-1" py="xl">
        <Stack gap="xl">
          <Stack gap={4}>
            <Title order={1} className="text-3xl">
              {t('help.title')}
            </Title>
            <Text c="dimmed" size="sm">
              {t('help.subtitle')}
            </Text>
          </Stack>

          <Accordion variant="separated" radius="md">
            {faqs.map((faq) => (
              <Accordion.Item key={faq.question} value={faq.question}>
                <Accordion.Control>{faq.question}</Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm" c="dimmed">
                    {faq.answer}
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>

          <Text size="sm" c="dimmed">
            {t('help.support.prompt')}{' '}
            <Anchor component={Link} to="/site/contact">
              {t('help.support.contactLink')}
            </Anchor>
            {t('help.support.orHeadBack')}{' '}
            <Anchor component={Link} to="/">
              {t('help.support.homeLink')}
            </Anchor>
            {t('help.support.end')}
          </Text>
        </Stack>
      </Container>
    </div>
  )
}
