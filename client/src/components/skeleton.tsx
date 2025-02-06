/**
 * Skeleton component that displays a loading animation.
 *
 * This component renders a series of div elements with different widths and heights
 * to simulate the loading state of a page or a section of a page. It uses Tailwind CSS
 * classes for styling and animations.
 *
 * @component
 * @example
 * return (
 *   <Skeleton />
 * )
 */
export default function Skeleton() {
	return (
		<div aria-live="polite" className="animate-in max-w-sm animate-pulse">
			<div className="mb-4 h-10 w-48 rounded-md bg-gray-200 dark:bg-gray-700" />
			<div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700" />
			<div className="mb-2.5 h-2 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700" />
			<div className="mb-2.5 h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
			<div className="mb-2.5 h-2 max-w-[330px] rounded-full bg-gray-200 dark:bg-gray-700" />
			<div className="mb-2.5 h-2 max-w-[300px] rounded-full bg-gray-200 dark:bg-gray-700" />
			<div className="h-2 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700" />
			<span className="sr-only">Loading...</span>
		</div>
	);
}
