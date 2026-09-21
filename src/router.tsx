import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { DbClient } from '@tanstack/react-db'
import { routerWithDbClient } from '@tanstack/react-router-with-db'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
    },
  })
  const dbClient = new DbClient({ queryClient })

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient, dbClient },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  setupRouterSsrQueryIntegration({ router, queryClient })

  return routerWithDbClient(router, dbClient)
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}

declare module '@tanstack/router-core' {
  interface StaticDataRouteOption {
    breadcrumb?: string
  }
}
