import { getRouteApi } from '@tanstack/react-router'

export function useSession() {
  const routeApi = getRouteApi('__root__')
  const { session } = routeApi.useRouteContext()

  return session
}
