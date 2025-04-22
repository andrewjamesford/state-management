import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import api from "~/api";
import ErrorMessage from "~/components/errorMessage";
import ListingTile from "~/components/listingTile";
import Skeleton from "~/components/skeleton";
import type { Listing } from "~/models";

export const Route = createFileRoute("/tsquery/")({
	component: RouteComponent,
});

// tanstack query example
function RouteComponent() {
	const {
		data: auctions = [],
		isLoading,
		error,
	} = useQuery<Listing[]>({
		queryKey: ["listings"],
		queryFn: async () => {
			try {
				return await api.getListings();
			} catch (error) {
				throw new Error(
					`Error retrieving listings: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	});

	if (error) return <ErrorMessage message={(error as Error)?.message} />;
	return (
		<div className="max-w-4xl mx-auto px-4 py-5">
			<div className="my-4">
				<Link
					to="/tsquery/add"
					className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				>
					Add Listing
				</Link>
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{isLoading && <Skeleton layoutType="card" repeat={3} />}
				{auctions.map((auction: Listing, counter: number) => (
					<ListingTile
						key={auction?.id ? auction.id : counter}
						listing={auction}
						basePath="/tsquery"
					/>
				))}
			</div>
			<div className="my-4">
				<Link
					to="/reduxrtk/add"
					className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				>
					Add Listing
				</Link>
			</div>
		</div>
	);
}
