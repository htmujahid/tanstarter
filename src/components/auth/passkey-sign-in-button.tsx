import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Alert, Button, Divider, Stack } from '@mantine/core'
import { IconAlertCircle, IconFingerprint } from '@tabler/icons-react'
import { signIn } from '#/lib/auth-client'

export function PasskeySignInButton() {
  const navigate = useNavigate()
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
        void signIn.passkey({ autoFill: true }).then(({ error: signInError }) => {
          if (!cancelled && !signInError) {
            void navigate({ to: '/home' })
          }
        })
      }
    })

    return () => {
      cancelled = true
    }
  }, [navigate])

  async function handleClick() {
    setError(null)
    setLoading(true)
    const { error: signInError } = await signIn.passkey()
    setLoading(false)

    if (signInError) {
      setError(signInError.message ?? 'Unable to sign in with passkey')
      return
    }

    await navigate({ to: '/home' })
  }

  return (
    <Stack gap="md">
      <Divider label="or" labelPosition="center" />

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
        Sign in with a passkey
      </Button>
    </Stack>
  )
}
