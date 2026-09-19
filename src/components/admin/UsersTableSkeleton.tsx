import { Skeleton, Table } from '@mantine/core'

export default function UsersTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Table.ScrollContainer minWidth={640}>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>User</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Joined</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Array.from({ length: rows }, (_, i) => (
            <Table.Tr key={i}>
              <Table.Td>
                <Skeleton height={14} width={140} mb={6} />
                <Skeleton height={11} width={180} />
              </Table.Td>
              <Table.Td>
                <Skeleton height={20} width={60} radius="xl" />
              </Table.Td>
              <Table.Td>
                <Skeleton height={20} width={60} radius="xl" />
              </Table.Td>
              <Table.Td>
                <Skeleton height={14} width={90} />
              </Table.Td>
              <Table.Td ta="right">
                <Skeleton height={28} width={28} radius="md" ml="auto" />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
