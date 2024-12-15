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
		<div role="status" className="max-w-sm animate-pulse animate-in">
			<div className="h-10 bg-gray-200 rounded-md dark:bg-gray-700 w-48 mb-4" />
			<div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4" />
			<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5" />
			<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5" />
			<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5" />
			<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5" />
			<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]" />
			<span className="sr-only">Loading...</span>
		</div>
	);
}
