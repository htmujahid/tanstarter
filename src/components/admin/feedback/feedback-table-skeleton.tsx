import { Skeleton, Table } from '@mantine/core'
import { useTranslation } from 'react-i18next'

export function FeedbackTableSkeleton({ rows = 5 }: { rows?: number }) {
  const { t } = useTranslation('admin')

  return (
    <Table.ScrollContainer minWidth={720}>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Skeleton height={18} width={18} radius="sm" />
            </Table.Th>
            <Table.Th>{t('feedback.table.submitterColumn')}</Table.Th>
            <Table.Th>{t('feedback.table.categoryColumn')}</Table.Th>
            <Table.Th>{t('feedback.table.messageColumn')}</Table.Th>
            <Table.Th>{t('feedback.table.statusColumn')}</Table.Th>
            <Table.Th>{t('feedback.table.submittedColumn')}</Table.Th>
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
                <Skeleton height={18} width={60} radius="xl" />
              </Table.Td>
              <Table.Td>
                <Skeleton height={14} width={220} />
              </Table.Td>
              <Table.Td>
                <Skeleton height={18} width={70} radius="xl" />
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
