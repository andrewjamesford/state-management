import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/multi')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/multi"!</div>
}
