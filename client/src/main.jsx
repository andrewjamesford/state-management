import App from "@/app.jsx";
import ErrorPage from "@/components/errorPage";
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";

import "@/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<StrictMode>
		<ErrorBoundary
			fallback={<ErrorPage message="Something went wrong" />}
			onError={(error) => console.error(error)}
		>
			<App />
		</ErrorBoundary>
	</StrictMode>,
);
