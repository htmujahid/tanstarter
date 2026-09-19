import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './src/server/db/migrations',
  schema: './src/server/db/schemas/index.ts',
  dialect: 'sqlite',
})
