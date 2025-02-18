import { createFileRoute, Link } from "@tanstack/react-router";
import { useGetListingsQuery } from "~/store/listingApi";
import ListingTile from "~/components/listingTile";
import type { Listing } from "~/models";
import Skeleton from "~/components/skeleton";

export const Route = createFileRoute("/redux/")({
	component: RouteComponent,
});

/**
 * A component that displays a grid of auction listings using Redux for state management.
 *
 * @component
 * @returns {JSX.Element} A layout containing:
 *  - An "Add Listing" button that links to the creation page
 *  - A responsive grid of auction listings
 *
 * Features:
 * - Uses RTK Query's useGetListingsQuery hook to fetch auction data
 * - Displays loading state using Skeleton components while data is being fetched
 * - Shows error message if data fetching fails
 * - Renders listings in a responsive grid layout (1 column mobile, 2 columns tablet, 3 columns desktop)
 *
 * @remarks
 * The Skeleton component is used as a loading placeholder that mimics the shape and size
 * of the actual content before it loads. It creates a visual placeholder animation
 * that prevents layout shift and improves perceived performance.
 */
function RouteComponent() {
	const { data: auctions = [], isLoading, error } = useGetListingsQuery();

	if (error) return <p>Error: {error.toString()}</p>;
	return (
		<>
			<div className="my-4">
				<Link
					to="/redux/add"
					className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				>
					Add Listing
				</Link>
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{isLoading && <Skeleton layoutType="card" repeat={3} />}
				{auctions.map((auction: Listing, counter: number) => (
					<ListingTile
						key={
							auction?.titleCategory?.id ? auction.titleCategory.id : counter
						}
						listing={auction}
						basePath="/redux"
					/>
				))}
			</div>
		</>
	);
}
