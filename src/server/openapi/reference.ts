import { Scalar } from '@scalar/hono-api-reference'

export const apiReferencePage = Scalar({
  pageTitle: 'Starter Kit API Reference',
  sources: [
    { url: '/api/auth/open-api/generate-schema', title: 'Auth' },
    { url: '/api/v1/doc', title: 'v1' },
    { url: '/api/platform/doc', title: 'Platform' },
  ],
})
