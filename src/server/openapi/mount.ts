import type { OpenAPIHono } from '@hono/zod-openapi'

export function registerSecuritySchemes(app: OpenAPIHono<any>) {
  app.openAPIRegistry.registerComponent('securitySchemes', 'sessionCookie', {
    type: 'apiKey',
    in: 'cookie',
    name: 'better-auth.session_token',
    description:
      'better-auth session cookie (production uses a __Secure- prefix)',
  })
  app.openAPIRegistry.registerComponent('securitySchemes', 'apiKey', {
    type: 'apiKey',
    in: 'header',
    name: 'x-api-key',
    description: '@better-auth/api-key plugin key',
  })
}

/**
 * Applied as the document-level default security requirement (rather than
 * repeated per-route) because `@hono/zod-openapi@1.6.3` has a type-inference
 * bug: a route-level `security` array with 2+ requirement objects, combined
 * with a custom `Env` generic on `OpenAPIHono`, breaks `c.req.valid()`'s
 * type inference (reports `'param'`/`'json'` as not assignable to `never`).
 * A document-level default plus a per-route `security: []` override for
 * public routes sidesteps the bug and is standard OpenAPI besides.
 *
 * Only publishes the raw spec at `/doc` — there is no per-group `/reference`
 * page. All three groups (auth/v1/platform) are browsed from one combined
 * page at `/api/reference` (see `#/server/openapi/reference`), which needs
 * each spec's *absolute* path (`/api/v1/doc`, not `/doc`) since the browser
 * resolves a Scalar source URL relative to `/api/reference`, not to where
 * the spec itself is mounted.
 */
export function mountDocs(app: OpenAPIHono<any>, title: string) {
  app.doc31('/doc', {
    openapi: '3.1.0',
    info: { title, version: '1.0.0' },
    security: [{ sessionCookie: [] }, { apiKey: [] }],
  })
}
