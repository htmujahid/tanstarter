import { useEffect } from 'react'

export function RegisterServiceWorker() {
  useEffect(() => {
    // dist/client/sw.js only exists after a production build (see the
    // `pwaServiceWorker` vite plugin) — there's nothing to register in dev.
    if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return

    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .catch((error: unknown) => {
        console.error('Service worker registration failed', error)
      })
  }, [])

  return null
}
