import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Alert, Button, Divider, Stack } from '@mantine/core'
import { IconAlertCircle, IconFingerprint } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { signIn } from '#/lib/auth-client'
import { CURRENT_SESSION_QUERY_KEY } from '#/lib/queries/session.query'

export function PasskeySignInButton() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const isConditionalMediationAvailable = (
      window as {
        PublicKeyCredential?: {
          isConditionalMediationAvailable?: () => Promise<boolean>
        }
      }
    ).PublicKeyCredential?.isConditionalMediationAvailable

    if (!isConditionalMediationAvailable) return

    let cancelled = false

    void isConditionalMediationAvailable().then((available) => {
      if (available && !cancelled) {
        void signIn
          .passkey({ autoFill: true })
          .then(async ({ error: signInError }) => {
            if (!cancelled && !signInError) {
              await queryClient.invalidateQueries({
                queryKey: CURRENT_SESSION_QUERY_KEY,
              })
              void navigate({ to: '/home' })
            }
          })
      }
    })

    return () => {
      cancelled = true
    }
  }, [navigate, queryClient])

  async function handleClick() {
    setError(null)
    setLoading(true)
    const { error: signInError } = await signIn.passkey()
    setLoading(false)

    if (signInError) {
      setError(signInError.message ?? t('passkey.genericError'))
      return
    }

    await queryClient.invalidateQueries({
      queryKey: CURRENT_SESSION_QUERY_KEY,
    })
    await navigate({ to: '/home' })
  }

  return (
    <Stack gap="md">
      <Divider label={t('passkey.divider')} labelPosition="center" />

      {error && (
        <Alert color="red" icon={<IconAlertCircle size={16} />}>
          {error}
        </Alert>
      )}

      <Button
        type="button"
        variant="default"
        leftSection={<IconFingerprint size={16} />}
        loading={loading}
        fullWidth
        onClick={handleClick}
      >
        {t('passkey.submit')}
      </Button>
    </Stack>
  )
}
