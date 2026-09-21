import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Group, Stack } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { ApiKeysTable } from '#/components/home/api-keys/api-keys-table'
import { ApiKeysTableSkeleton } from '#/components/home/api-keys/api-keys-table-skeleton'
import { CreateApiKeyForm } from '#/components/home/api-keys/create-api-key-form'
import { RevealApiKeyModal } from '#/components/home/api-keys/reveal-api-key-modal'
import { apiKeysQueryOptions } from '#/lib/queries/api-key.query'

export const Route = createFileRoute('/home/api-keys')({
  loader: ({ context }) =>
    context.queryClient.query({
      ...apiKeysQueryOptions(),
      staleTime: 'static',
    }),
  pendingComponent: () => <ApiKeysTableSkeleton />,
  staticData: { breadcrumb: 'API Keys' },
  component: ApiKeysPage,
})

function ApiKeysPage() {
  const { t } = useTranslation('home')
  const queryClient = useQueryClient()
  const [createOpened, setCreateOpened] = useState(false)
  const [revealedKey, setRevealedKey] = useState<string | null>(null)

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['api-key', 'list'] })

  return (
    <Stack gap="md">
      <Group justify="flex-end">
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setCreateOpened(true)}
        >
          {t('apiKeys.createButton')}
        </Button>
      </Group>

      <ApiKeysTable
        onAddKey={() => setCreateOpened(true)}
        onChanged={invalidate}
      />

      <CreateApiKeyForm
        opened={createOpened}
        onClose={() => setCreateOpened(false)}
        onCreated={(key) => {
          setCreateOpened(false)
          setRevealedKey(key)
          invalidate()
        }}
      />

      <RevealApiKeyModal
        apiKey={revealedKey}
        onClose={() => setRevealedKey(null)}
      />
    </Stack>
  )
}
