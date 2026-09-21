import { useEffect, useState } from 'react'
import { startOfflineExecutor } from '@tanstack/offline-transactions'
import { useDbClient } from '@tanstack/react-db'
import { notesCollectionOptions } from '#/lib/collections/notes.collection'
import { notesMutationFns } from '#/lib/mutations/notes.mutation'
import type { OfflineExecutor } from '@tanstack/offline-transactions'
import type { DbClient } from '@tanstack/react-db'

interface PersistableTransaction {
  isPersisted: { promise: Promise<unknown> }
}

export function waitForTransaction(tx: PersistableTransaction): Promise<void> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    let settled = false
    const onOffline = () => {
      if (settled) return
      settled = true
      window.removeEventListener('offline', onOffline)
      resolve()
    }
    window.addEventListener('offline', onOffline)

    tx.isPersisted.promise.then(
      () => {
        if (settled) return
        settled = true
        window.removeEventListener('offline', onOffline)
        resolve()
      },
      (error: unknown) => {
        if (settled) return
        settled = true
        window.removeEventListener('offline', onOffline)
        reject(error)
      },
    )
  })
}

let executorPromise: Promise<OfflineExecutor> | null = null

async function createOfflineExecutor(
  client: DbClient,
): Promise<OfflineExecutor> {
  const executor = startOfflineExecutor({
    collections: {
      notes: client.collection(notesCollectionOptions),
    },
    mutationFns: {
      ...notesMutationFns,
    },
  })
  await executor.waitForInit()
  return executor
}

export function getOfflineExecutor(client: DbClient): Promise<OfflineExecutor> {
  if (typeof window === 'undefined') {
    throw new Error('Offline transactions are only available in the browser.')
  }
  if (!executorPromise) {
    executorPromise = createOfflineExecutor(client)
  }
  return executorPromise
}

export function useOfflineExecutor(): OfflineExecutor | undefined {
  const client = useDbClient()
  const [executor, setExecutor] = useState<OfflineExecutor>()

  useEffect(() => {
    let cancelled = false
    getOfflineExecutor(client).then((next) => {
      if (!cancelled) setExecutor(next)
    })
    return () => {
      cancelled = true
    }
  }, [client])

  return executor
}
