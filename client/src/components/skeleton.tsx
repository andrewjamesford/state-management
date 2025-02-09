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

interface SkeletonProps {
	layoutType?: "card" | "list";
	repeat?: number;
}

export default function Skeleton({ layoutType, repeat = 1 }: SkeletonProps) {
	const renderSkeleton = () => {
		if (layoutType === "card") {
			return (
				<div className="animate-pulse max-w-sm rounded-lg bg-gray-200 dark:bg-gray-500">
					<div className="h-60 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700" />
					<div className="p-4 h-40">
						<div className="h-4 w-1/2 mb-2 rounded-full bg-gray-200 dark:bg-gray-700" />
						<div className="h-4 w-full mb-2 rounded-full bg-gray-200 dark:bg-gray-700" />
						<div className="h-4 w-full mb-2 rounded-full bg-gray-200 dark:bg-gray-700" />
						<div className="h-4 w-1/2 mb-2 rounded-full bg-gray-200 dark:bg-gray-700" />
					</div>
				</div>
			);
		}

		if (layoutType === "list") {
			return (
				<div className="animate-pulse max-w-sm rounded-lg bg-gray-200 dark:bg-gray-700">
					<div className="p-4">
						<div className="h-4 w-1/2 mb-2 rounded-full bg-gray-200 dark:bg-gray-700" />
						<div className="h-4 w-full mb-2 rounded-full bg-gray-200 dark:bg-gray-700" />
						<div className="h-4 w-full mb-2 rounded-full bg-gray-200 dark:bg-gray-700" />
						<div className="h-4 w-1/2 mb-2 rounded-full bg-gray-200 dark:bg-gray-700" />
					</div>
				</div>
			);
		}

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
	};

	return (
		<>
			{Array.from({ length: repeat }, (_, index) => (
				<div key={index}>{renderSkeleton()}</div>
			))}
		</>
	);
}
