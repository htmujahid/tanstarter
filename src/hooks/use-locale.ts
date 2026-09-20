import { getRouteApi } from '@tanstack/react-router'

export function useLocale() {
  const routeApi = getRouteApi('__root__')
  const { locale } = routeApi.useRouteContext()

  return locale
}
