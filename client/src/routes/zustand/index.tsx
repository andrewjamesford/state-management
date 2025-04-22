import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import ErrorMessage from "~/components/errorMessage";
import ListingTile from "~/components/listingTile";
import Skeleton from "~/components/skeleton";
import { useListingStore } from "~/store/zustand/listingStore";

export const Route = createFileRoute("/zustand/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { listings, isLoading, error, fetchListings } = useListingStore();

	useEffect(() => {
		fetchListings();
	}, [fetchListings]);

	if (error) return <ErrorMessage message={error} />;

	return (
		<div className="max-w-4xl mx-auto px-4 py-5">
			<div className="my-4">
				<Link
					to="/zustand/add"
					className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				>
					Add Listing
				</Link>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{isLoading && <Skeleton layoutType="card" repeat={3} />}
				{listings.map((listing) => (
					<ListingTile key={listing.id} listing={listing} basePath="/zustand" />
				))}
			</div>

			<div className="my-4">
				<Link
					to="/zustand/add"
					className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				>
					Add Listing
				</Link>
			</div>
		</div>
	);
}
