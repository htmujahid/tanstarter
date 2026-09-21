import type {
  BrowserCollectionCoordinator as BrowserCollectionCoordinatorType,
  BrowserWASQLiteDatabase,
  PersistedCollectionPersistence,
} from '@tanstack/browser-db-sqlite-persistence'

const DATABASE_NAME = 'starter-kit-app.sqlite'

let browserDatabase: BrowserWASQLiteDatabase | undefined
let browserCoordinator: BrowserCollectionCoordinatorType | undefined

function createServerPersistenceStub(): PersistedCollectionPersistence {
  return {
    adapter: {
      loadSubset: async () => [],
      applyCommittedTx: async () => {},
      ensureIndex: async () => {},
    },
  }
}

export const persistence: PersistedCollectionPersistence =
  typeof window === 'undefined'
    ? createServerPersistenceStub()
    : await (async () => {
        const {
          BrowserCollectionCoordinator,
          createBrowserWASQLitePersistence,
          openBrowserWASQLiteOPFSDatabase,
        } = await import('@tanstack/browser-db-sqlite-persistence')

        browserDatabase = await openBrowserWASQLiteOPFSDatabase({
          databaseName: DATABASE_NAME,
        })
        browserCoordinator = new BrowserCollectionCoordinator({
          dbName: DATABASE_NAME,
        })

        return createBrowserWASQLitePersistence({
          database: browserDatabase,
          coordinator: browserCoordinator,
        })
      })()

export async function clearClientPersistence(): Promise<void> {
  const { IndexedDBAdapter, LocalStorageAdapter } =
    await import('@tanstack/offline-transactions')
  browserCoordinator?.dispose()
  try {
    await browserDatabase?.close?.()
  } catch {}
  await Promise.all([
    new IndexedDBAdapter().clear(),
    new LocalStorageAdapter().clear(),
  ])
  const root = await navigator.storage.getDirectory()
  const names: Array<string> = []
  for await (const name of root.keys()) {
    if (name === DATABASE_NAME || name.startsWith(`${DATABASE_NAME}-`)) {
      names.push(name)
    }
  }
  const results = await Promise.allSettled(
    names.map((name) => root.removeEntry(name, { recursive: true })),
  )
  if (results.some((result) => result.status === 'rejected')) {
    throw new Error(
      'Some local data files are still in use. Close other tabs and try again.',
    )
  }
}
