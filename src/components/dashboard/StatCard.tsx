import { Card, Group, Text, ThemeIcon } from '@mantine/core'
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react'
import type { Icon } from '@tabler/icons-react'

export default function StatCard({
  label,
  value,
  change,
  icon: Icon,
}: {
  label: string
  value: string
  change: number
  icon: Icon
}) {
  const isPositive = change >= 0

  return (
    <Card withBorder radius="md" padding="lg">
      <Group justify="space-between" mb="xs">
        <Text size="sm" c="dimmed" fw={500}>
          {label}
        </Text>
        <ThemeIcon variant="light" color="blue" size={32} radius="md">
          <Icon size={18} stroke={1.75} />
        </ThemeIcon>
      </Group>

      <Text fw={700} className="text-2xl">
        {value}
      </Text>

      <Group gap={4} mt={4}>
        {isPositive ? (
          <IconArrowUpRight
            size={14}
            className="text-[var(--mantine-color-teal-6)]"
          />
        ) : (
          <IconArrowDownRight
            size={14}
            className="text-[var(--mantine-color-red-6)]"
          />
        )}
        <Text size="xs" c={isPositive ? 'teal' : 'red'} fw={600}>
          {isPositive ? '+' : ''}
          {change}%
        </Text>
        <Text size="xs" c="dimmed">
          vs last period
        </Text>
      </Group>
    </Card>
  )
}
