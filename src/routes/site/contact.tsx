import { Link, createFileRoute } from '@tanstack/react-router'
import { Anchor, Container, Stack, Text, Title } from '@mantine/core'
import { ContactForm } from '#/components/site/contact/contact-form'

export const Route = createFileRoute('/site/contact')({
  component: ContactPage,
})

function ContactPage() {
  return (
    <Container size="xs" py="xl">
      <Stack gap="xl">
        <Stack gap={4}>
          <Title order={1} className="text-3xl">
            Contact us
          </Title>
          <Text c="dimmed" size="sm">
            Have a question or need help? Send us a message and we&apos;ll get
            back to you.
          </Text>
        </Stack>

        <ContactForm />

        <Text size="sm" c="dimmed">
          Looking for answers first? Check our{' '}
          <Anchor component={Link} to="/help">
            help &amp; FAQ
          </Anchor>
          .
        </Text>
      </Stack>
    </Container>
  )
}
