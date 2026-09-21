import { Badge } from '@mantine/core'
import { useNetwork } from '@mantine/hooks'
import { IconWifiOff } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export function OfflineStatusBadge() {
  const { online } = useNetwork()
  const { t } = useTranslation()

  if (online) return null

  return (
    <Badge
      color="red"
      variant="light"
      size="lg"
      radius="sm"
      leftSection={<IconWifiOff size={14} />}
    >
      {t('offline.label')}
    </Badge>
  )
}
