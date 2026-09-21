import { apiKeyClient } from '@better-auth/api-key/client'
import { i18nClient } from '@better-auth/i18n/client'
import { passkeyClient } from '@better-auth/passkey/client'
import { adminClient, usernameClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

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
    i18nClient(),
  ],
})

export const { signIn, signUp, signOut, useSession } = authClient
