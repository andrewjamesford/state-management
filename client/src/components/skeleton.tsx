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
				<div
					aria-live="polite"
					// biome-ignore lint/a11y/useSemanticElements: React.Fragment is not a semantic element
					role="status"
					className="animate-pulse max-w-sm rounded-lg bg-gray-200 dark:bg-gray-500"
				>
					<div className="h-60 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700" />
					<div className="p-4 h-40">
						<div className="h-4 w-1/2 mb-2 rounded-full bg-gray-200 dark:bg-gray-700" />
						<div className="h-4 w-full mb-2 rounded-full bg-gray-200 dark:bg-gray-700" />
						<div className="h-4 w-full mb-2 rounded-full bg-gray-200 dark:bg-gray-700" />
						<div className="h-4 w-1/2 mb-2 rounded-full bg-gray-200 dark:bg-gray-700" />
					</div>
					<span className="sr-only">Loading...</span>
				</div>
			);
		}

		if (layoutType === "list") {
			return (
				<div
					aria-live="polite"
					// biome-ignore lint/a11y/useSemanticElements: React.Fragment is not a semantic element
					role="status"
					className="animate-pulse max-w-sm rounded-lg bg-gray-200 dark:bg-gray-700"
				>
					<div className="p-4">
						<div className="h-4 w-1/2 mb-2 rounded-full bg-gray-200 dark:bg-gray-700" />
						<div className="h-4 w-full mb-2 rounded-full bg-gray-200 dark:bg-gray-700" />
						<div className="h-4 w-full mb-2 rounded-full bg-gray-200 dark:bg-gray-700" />
						<div className="h-4 w-1/2 mb-2 rounded-full bg-gray-200 dark:bg-gray-700" />
					</div>
					<span className="sr-only">Loading...</span>
				</div>
			);
		}

		return (
			// biome-ignore lint/a11y/useSemanticElements: React.Fragment is not a semantic element
			<div role="status" aria-live="polite" className="animate-pulse block">
				<div className="mb-4 h-10 w-48 rounded-md bg-gray-200 dark:bg-gray-700" />
				<span className="sr-only">Loading...</span>
			</div>
		);
	};

	return (
		<>
			{Array.from({ length: repeat }, (_, index) => (
				<div key={`skeleton-${index}-${layoutType || "default"}`}>
					{renderSkeleton()}
				</div>
			))}
		</>
	);
}
