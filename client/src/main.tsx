// import App from "@/app.jsx";
import ErrorPage from "@/components/errorPage";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { RouterProvider, createRouter } from '@tanstack/react-router'


// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}


const rootElement = document.getElementById("root");
if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<StrictMode>
			<ErrorBoundary
				fallback={<ErrorPage message="Something went wrong" />}
				onError={(error) => console.error(error)}
			>
				<RouterProvider router={router} />
			</ErrorBoundary>
		</StrictMode>,
	);
} else {
	console.error("Root element not found");
}
