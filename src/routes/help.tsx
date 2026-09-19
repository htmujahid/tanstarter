import { Link, createFileRoute } from '@tanstack/react-router'
import { Accordion, Anchor, Container, Stack, Text, Title } from '@mantine/core'

import Header from '#/components/Header'

export const Route = createFileRoute('/help')({ component: Help })

const faqs = [
  {
    question: 'How do I add a new product?',
    answer:
      'Go to Products and click "Add product". Enter the name, price, images, and stock details, then publish it to make it visible in your store.',
  },
  {
    question: 'How do I manage and fulfill orders?',
    answer:
      'Open the Orders section to see every order as it comes in. Click into an order to update its status, print a packing slip, or issue a refund.',
  },
  {
    question: 'How do I keep track of inventory?',
    answer:
      "Each product's stock count is shown right in Products, and you'll get a low-stock alert automatically so you never oversell an item.",
  },
  {
    question: 'Can I invite my team to help manage the store?',
    answer:
      'Yes — invite teammates from the Team section and assign them a role, like Admin or Staff, to control what they can see and do.',
  },
  {
    question: 'How do I see how my store is performing?',
    answer:
      'The Dashboard gives you a quick view of sales, orders, and top-selling products, so you can track how your store is doing at a glance.',
  },
  {
    question: 'How do I update my store settings?',
    answer:
      'Head to Settings to update your store name, currency, shipping options, and payment methods at any time.',
  },
]

function Help() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <Container size="sm" className="w-full flex-1" py="xl">
        <Stack gap="xl">
          <Stack gap={4}>
            <Title order={1} className="text-3xl">
              Help &amp; FAQ
            </Title>
            <Text c="dimmed" size="sm">
              Answers to common questions about running your store from this
              dashboard.
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
            Still need help? Contact our support team, or head{' '}
            <Anchor component={Link} to="/">
              back to home
            </Anchor>
            .
          </Text>
        </Stack>
      </Container>
    </div>
  )
}
