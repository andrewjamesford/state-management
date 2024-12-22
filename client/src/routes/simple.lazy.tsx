import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/simple")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/simple"!</div>;
}
