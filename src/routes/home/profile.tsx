import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/home/profile"!</div>
}
