import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import api from "~/api";
import ListingTile from "~/components/listingTile";

export const Route = createFileRoute("/tsquery/")({
	component: RouteComponent,
});

interface Listing {
	id: string;
	title: string;
	sub_title: string;
	listing_description: string;
	listing_price: number;
	category: string;
	image: string;
	reserve_price?: number;
}

function RouteComponent() {
	const {
		data: auctions = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["listings"],
		queryFn: async () => {
			const response = await api.getListings();
			if (!response.ok) throw new Error("Error retrieving listings");
			return await response.json();
		},
	});

	if (isLoading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{auctions.map((auction: Listing) => (
				<ListingTile key={auction.id} listing={auction} basePath="/tsquery" />
			))}
		</div>
	);
}
