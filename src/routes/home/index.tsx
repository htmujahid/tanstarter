import { createFileRoute } from '@tanstack/react-router'
import { AreaChart, BarsList, DonutChart } from '@mantine/charts'
import mantineChartsCss from '@mantine/charts/styles.css?url'
import {
  Badge,
  Card,
  Grid,
  Group,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core'
import {
  IconCurrencyDollar,
  IconShoppingCart,
  IconTrendingUp,
  IconUsers,
} from '@tabler/icons-react'
import StatCard from '#/components/dashboard/StatCard'
import {
  formatCurrency,
  recentOrders,
  revenueSeries,
  salesByCategory,
  stats,
  topProducts,
} from '#/lib/dashboard-data'
import type { OrderStatus } from '#/lib/dashboard-data'

export const Route = createFileRoute('/home/')({
  head: () => ({
    links: [{ rel: 'stylesheet', href: mantineChartsCss }],
  }),
  component: Home,
})

const STAT_ICONS = {
  revenue: IconCurrencyDollar,
  orders: IconShoppingCart,
  customers: IconUsers,
  conversion: IconTrendingUp,
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  Fulfilled: 'teal',
  Processing: 'blue',
  Pending: 'yellow',
  Refunded: 'gray',
}

function Home() {
  return (
    <Stack gap="md">
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            icon={STAT_ICONS[stat.icon]}
          />
        ))}
      </SimpleGrid>

      <Grid gap="md">
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Card withBorder radius="md" padding="lg" h="100%">
            <Stack gap={2} mb="md">
              <Title order={3}>Revenue</Title>
              <Text c="dimmed" size="sm">
                Last 14 days
              </Text>
            </Stack>
            <AreaChart
              h={280}
              data={revenueSeries}
              dataKey="date"
              series={[{ name: 'revenue', color: 'blue.6', label: 'Revenue' }]}
              curveType="monotone"
              withGradient
              withLegend={false}
              valueFormatter={(value) => formatCurrency(value)}
            />
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Card withBorder radius="md" padding="lg" h="100%">
            <Stack gap={2} mb="md">
              <Title order={3}>Sales by category</Title>
              <Text c="dimmed" size="sm">
                Share of total orders
              </Text>
            </Stack>

            <Group justify="center">
              <DonutChart
                data={salesByCategory}
                withTooltip
                size={170}
                thickness={24}
              />
            </Group>

            <Stack gap={6} mt="md">
              {salesByCategory.map((category) => (
                <Group
                  key={category.name}
                  justify="space-between"
                  wrap="nowrap"
                >
                  <Group gap={8} wrap="nowrap">
                    <span
                      className="inline-block size-2.5 rounded-full"
                      style={{
                        backgroundColor: `var(--mantine-color-${category.color.replace('.', '-')})`,
                      }}
                    />
                    <Text size="sm">{category.name}</Text>
                  </Group>
                  <Text size="sm" c="dimmed">
                    {category.value}%
                  </Text>
                </Group>
              ))}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <Card withBorder radius="md" padding="lg">
          <Stack gap={2} mb="md">
            <Title order={3}>Top products</Title>
            <Text c="dimmed" size="sm">
              By revenue, last 14 days
            </Text>
          </Stack>
          <BarsList
            data={topProducts}
            barColor="blue.6"
            valueFormatter={(value) => formatCurrency(value)}
          />
        </Card>

        <Card withBorder radius="md" padding="lg">
          <Stack gap={2} mb="md">
            <Title order={3}>Recent orders</Title>
            <Text c="dimmed" size="sm">
              Latest activity across your store
            </Text>
          </Stack>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Order</Table.Th>
                <Table.Th>Customer</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th ta="right">Amount</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {recentOrders.map((order) => (
                <Table.Tr key={order.id}>
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      {order.id}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {order.date}
                    </Text>
                  </Table.Td>
                  <Table.Td>{order.customer}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={STATUS_COLORS[order.status]}
                      variant="light"
                      size="sm"
                    >
                      {order.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td ta="right">{formatCurrency(order.amount)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </SimpleGrid>
    </Stack>
  )
}
