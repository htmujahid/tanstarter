import { Skeleton, Table } from '@mantine/core'
import { useTranslation } from 'react-i18next'

export function ApiKeysTableSkeleton({ rows = 3 }: { rows?: number }) {
  const { t } = useTranslation('home')

  return (
    <Table.ScrollContainer minWidth={720}>
      <Table verticalSpacing="sm" withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('apiKeys.table.nameColumn')}</Table.Th>
            <Table.Th>{t('apiKeys.table.keyColumn')}</Table.Th>
            <Table.Th>{t('apiKeys.table.createdColumn')}</Table.Th>
            <Table.Th>{t('apiKeys.table.expiresColumn')}</Table.Th>
            <Table.Th>{t('apiKeys.table.lastUsedColumn')}</Table.Th>
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
