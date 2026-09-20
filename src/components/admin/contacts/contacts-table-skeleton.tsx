import { Skeleton, Table } from '@mantine/core'

export function ContactsTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Table.ScrollContainer minWidth={640}>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Skeleton height={18} width={18} radius="sm" />
            </Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Message</Table.Th>
            <Table.Th>Submitted</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Array.from({ length: rows }, (_, i) => (
            <Table.Tr key={i}>
              <Table.Td>
                <Skeleton height={18} width={18} radius="sm" />
              </Table.Td>
              <Table.Td>
                <Skeleton height={14} width={140} mb={6} />
                <Skeleton height={11} width={180} />
              </Table.Td>
              <Table.Td>
                <Skeleton height={14} width={260} />
              </Table.Td>
              <Table.Td>
                <Skeleton height={14} width={120} />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
