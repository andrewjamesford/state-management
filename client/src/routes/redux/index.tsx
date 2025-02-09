import { createFileRoute, Link } from "@tanstack/react-router";
import { useGetListingsQuery } from "~/store/listingApi";
import ListingTile from "~/components/listingTile";
import type { Listing } from "~/models";
import Skeleton from "~/components/skeleton";

export const Route = createFileRoute("/redux/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: auctions = [], isLoading, error } = useGetListingsQuery();

	// if (error) return <p>Error: {error.toString()}</p>;
	console.log(auctions);
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
