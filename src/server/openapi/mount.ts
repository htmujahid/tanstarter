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

export function mountDocs(app: OpenAPIHono<any>, title: string) {
  app.doc31('/doc', {
    openapi: '3.1.0',
    info: { title, version: '1.0.0' },
    security: [{ sessionCookie: [] }, { apiKey: [] }],
  })
}
