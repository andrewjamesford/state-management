/**
 * Footer component that displays a footer section with a demo badge and a description.
 *
 * @component
 * @example
 * return (
 *   <Footer />
 * )
 */
export default function Footer() {
	return (
		<footer className="px-4 py-2 bg-gray-100">
			<div className="flex items-center space-x-2 text-sm">
				<div className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
					Demo
				</div>
				<p className="text-gray-600">
					This application is a demonstration for using multiple ways to handle
					State Management in React.js
				</p>
			</div>
		</footer>
	);
}
