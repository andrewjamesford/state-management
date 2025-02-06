import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import api from "~/api";
import ListingTile from "~/components/listingTile";
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
	} = useQuery({
		queryKey: ["listings"],
		queryFn: async () => {
			const response = await api.getListings();

			if (!response.ok) throw new Error("Error retrieving listings");
			const listings = await response.json();
			// biome-ignore lint/suspicious/noExplicitAny: Saves having to create a new type
			const arrayListings: Listing[] = listings.map((listing: any) => ({
				titleCategory: {
					id: listing.id,
					title: listing.title,
					categoryId: listing.categoryid,
					subCategoryId: listing.subcategoryid,
					subTitle: listing.subtitle,
					endDate: listing.enddate,
				},
				itemDetails: {
					description: listing.listingdescription,
				},
				pricePayment: {
					listingPrice: listing.listingprice,
					reservePrice: listing.reserveprice,
					creditCardPayment: listing.creditcardpayment,
					bankTransferPayment: listing.banktransferpayment,
					bitcoinPayment: listing.bitcoinpayment,
				},
				shipping: {
					pickUp: listing.pickup,
					shippingOption: listing.shippingoption,
				},
			}));
			console.log("arrayListings", arrayListings);
			return arrayListings;
		},
	});

	if (isLoading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;
	return (
		<>
			<div className="my-4">
				<Link
					to="/tsquery/add"
					className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				>
					Add Listing
				</Link>
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{auctions.map((auction: Listing, counter: Key | null | undefined) => (
					<ListingTile
						key={
							auction?.titleCategory?.id ? auction.titleCategory.id : counter
						}
						listing={auction}
						basePath="/tsquery"
					/>
				))}
			</div>
		</>
	);
}
