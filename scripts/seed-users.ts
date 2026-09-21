import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, username } from 'better-auth/plugins'
import { drizzle } from 'drizzle-orm/d1'
import { getPlatformProxy } from 'wrangler'

import * as schema from '../src/server/db/schemas'

const SEED_PASSWORD = 'Password123!'

const NAMES = [
  'Ava Thompson',
  'Liam Carter',
  'Olivia Bennett',
  'Noah Ramirez',
  'Emma Foster',
  'Ethan Brooks',
  'Sophia Coleman',
  'Mason Reyes',
  'Isabella Hayes',
  'Lucas Morgan',
  'Mia Sullivan',
  'Jack Ellison',
  'Charlotte Nguyen',
  'Henry Castillo',
  'Amelia Price',
  'Benjamin Ortiz',
  'Harper Dawson',
  'Elijah Marsh',
  'Evelyn Whitfield',
  'James Sutton',
]

const ADMIN_COUNT = 4

const users = NAMES.map((name, index) => {
  const [first, last] = name.toLowerCase().split(' ')
  return {
    name,
    email: `${first}.${last}@example.com`,
    username: `${first}${last}`,
    role: index < ADMIN_COUNT ? ('admin' as const) : ('user' as const),
  }
})

async function main() {
  const { env, dispose } = await getPlatformProxy<Env>()

  const db = drizzle(env.DB, { schema })
  const auth = betterAuth({
    database: drizzleAdapter(db, { provider: 'sqlite' }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    emailAndPassword: { enabled: true },
    plugins: [username(), admin()],
  })

  for (const seedUser of users) {
    try {
      await auth.api.createUser({
        body: {
          email: seedUser.email,
          password: SEED_PASSWORD,
          name: seedUser.name,
          role: seedUser.role,
          data: {
            username: seedUser.username,
            displayUsername: seedUser.name,
          },
        },
      })
      console.log(`create ${seedUser.email} (${seedUser.role})`)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.log(`skip  ${seedUser.email}: ${message}`)
    }
  }

  await dispose()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
