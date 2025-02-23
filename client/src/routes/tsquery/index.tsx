import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import api from "~/api";
import ListingTile from "~/components/listingTile";
import type { Listing, RawListing } from "~/models";
import Skeleton from "~/components/skeleton";
import ErrorMessage from "~/components/errorMessage";

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
			// Transform the raw listings into a more usable format
			const arrayListings: Listing[] = listings.map((listing: RawListing) => ({
				id: listing.id,
				title: listing.title,
				categoryId: listing.categoryid,
				subCategoryId: listing.subcategoryid,
				subTitle: listing.subtitle,
				endDate: listing.enddate,
				description: listing.listingdescription,
				listingPrice: listing.listingprice,
				reservePrice: listing.reserveprice,
				creditCardPayment: listing.creditcardpayment,
				bankTransferPayment: listing.banktransferpayment,
				bitcoinPayment: listing.bitcoinpayment,
				pickUp: listing.pickup,
				shippingOption: listing.shippingoption,
			}));
			return arrayListings;
		},
	});

	if (error) return <ErrorMessage message={error?.message} />;
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
				{isLoading && <Skeleton layoutType="card" repeat={3} />}
				{auctions.map((auction: Listing, counter: number) => (
					<ListingTile
						key={auction?.id ? auction.id : counter}
						listing={auction}
						basePath="/tsquery"
					/>
				))}
			</div>
		</>
	);
}
