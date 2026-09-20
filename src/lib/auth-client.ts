import { createAuthClient } from 'better-auth/react'
import { adminClient, usernameClient } from 'better-auth/client/plugins'
import { apiKeyClient } from '@better-auth/api-key/client'
import { passkeyClient } from '@better-auth/passkey/client'
import {
  ac,
  admin as adminRole,
  user as userRole,
} from '#/server/auth/permissions'

export const authClient = createAuthClient({
  plugins: [
    usernameClient(),
    adminClient({
      ac,
      roles: { admin: adminRole, user: userRole },
    }),
    passkeyClient(),
    apiKeyClient(),
  ],
})

export const { signIn, signUp, signOut, useSession } = authClient
