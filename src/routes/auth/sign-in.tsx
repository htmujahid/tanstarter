import { createFileRoute } from '@tanstack/react-router'
import { Stack, Text, Title } from '@mantine/core'
import SignInForm from '#/components/auth/SignInForm'

export const Route = createFileRoute('/auth/sign-in')({ component: SignIn })

function SignIn() {
  return (
    <Stack gap="xl">
      <Stack gap={4}>
        <Title order={2}>Welcome back</Title>
        <Text c="dimmed" size="sm">
          Sign in to your account to continue
        </Text>
      </Stack>

      <SignInForm />
    </Stack>
  )
}
