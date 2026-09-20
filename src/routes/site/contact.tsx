import { Link, createFileRoute } from '@tanstack/react-router'
import { Anchor, Container, Stack, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { ContactForm } from '#/components/site/contact/contact-form'

export const Route = createFileRoute('/site/contact')({
  component: ContactPage,
})

function ContactPage() {
  const { t } = useTranslation('site')

  return (
    <Container size="xs" py="xl">
      <Stack gap="xl">
        <Stack gap={4}>
          <Title order={1} className="text-3xl">
            {t('contact.title')}
          </Title>
          <Text c="dimmed" size="sm">
            {t('contact.subtitle')}
          </Text>
        </Stack>

        <ContactForm />

        <Text size="sm" c="dimmed">
          {t('contact.helpPrompt')}{' '}
          <Anchor component={Link} to="/help">
            {t('contact.helpLink')}
          </Anchor>
          {t('contact.helpEnd')}
        </Text>
      </Stack>
    </Container>
  )
}
