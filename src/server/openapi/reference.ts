import { Scalar } from '@scalar/hono-api-reference'

/**
 * Single combined docs page grouping all three API surfaces, mounted at
 * `/api/reference`. Uses Scalar's multi-source switcher rather than three
 * separate `/reference` pages — one place to browse Auth, v1, and Platform.
 * Source URLs are absolute (`/api/...`) since the browser resolves them
 * relative to this page's own URL, not to where each spec is mounted.
 */
export const apiReferencePage = Scalar({
  pageTitle: 'Commerce API Reference',
  sources: [
    { url: '/api/auth/open-api/generate-schema', title: 'Auth' },
    { url: '/api/v1/doc', title: 'v1' },
    { url: '/api/platform/doc', title: 'Platform' },
  ],
})
