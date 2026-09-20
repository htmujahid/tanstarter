import { Skeleton, Table } from '@mantine/core'

export function ApiKeysTableSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <Table.ScrollContainer minWidth={720}>
      <Table verticalSpacing="sm" withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Key</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th>Expires</Table.Th>
            <Table.Th>Last used</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Array.from({ length: rows }, (_, i) => (
            <Table.Tr key={i}>
              <Table.Td>
                <Skeleton height={14} width={140} />
              </Table.Td>
              <Table.Td>
                <Skeleton height={14} width={160} />
              </Table.Td>
              <Table.Td>
                <Skeleton height={14} width={90} />
              </Table.Td>
              <Table.Td>
                <Skeleton height={14} width={90} />
              </Table.Td>
              <Table.Td>
                <Skeleton height={14} width={90} />
              </Table.Td>
              <Table.Td>
                <Skeleton height={18} width={18} radius="sm" />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
