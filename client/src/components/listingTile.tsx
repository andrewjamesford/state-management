import { Link } from "@tanstack/react-router";
import type { Listing } from "~/models";

interface ListingTileProps {
	listing: Listing;
	basePath: string;
}

export default function ListingTile({ listing, basePath }: ListingTileProps) {
	console.log(listing);
	if (listing == null) return null;
	return (
		<Link
			to={`${basePath}/${listing.titleCategory.id}`}
			className="border border-gray-300 rounded-lg overflow-hidden flex flex-col min-h-[300px]"
		>
			<img
				src={"https://placehold.co/150"}
				alt={listing.titleCategory.title}
				className="w-full"
			/>
			<div className="p-4 flex flex-col h-full">
				<h2 className="text-xl font-bold">{listing.titleCategory.title}</h2>
				<h3 className="text-base italic pb-2">{listing.titleCategory.subTitle}</h3>
				<p className="pb-2">{listing.itemDetails.description}</p>
				<span className="text-sm mt-auto">
					{listing.pricePayment.listingPrice == null
						? "No reserve"
						: listing.pricePayment.listingPrice > listing.pricePayment.reservePrice
							? "Reserve met"
							: "Reserve not met"}{" "}
					{listing.pricePayment.listingPrice}
				</span>
			</div>
		</Link>
	);
}
