import App from "@/app.jsx";
import ErrorPage from "@/components/errorPage";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";


const rootElement = document.getElementById("root");
if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<StrictMode>
			<ErrorBoundary
				fallback={<ErrorPage message="Something went wrong" />}
				onError={(error) => console.error(error)}
			>
				<App />
			</ErrorBoundary>
		</StrictMode>,
	);
} else {
	console.error("Root element not found");
}
