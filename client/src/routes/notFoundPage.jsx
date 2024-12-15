/**
 * Renders a 404 Not Found page component
 * Displays a simple error message in a narrow layout with standard padding
 * @returns {JSX.Element} A main container with "Page Not Found" heading
 */
export default function NotFoundPage() {
	return (
		<main className="narrow-layout main-content section-padding page-padding">
			<div>
				<h2>Page Not Found</h2>
			</div>
		</main>
	);
}
