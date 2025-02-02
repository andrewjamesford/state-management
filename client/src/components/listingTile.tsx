import { Link } from "@tanstack/react-router";

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

interface ListingTileProps {
	listing: Listing;
	basePath: string;
}

export default function ListingTile({ listing, basePath }: ListingTileProps) {
	return (
		<Link
			to={`${basePath}/${listing.id}`}
			className="border border-gray-300 rounded-lg overflow-hidden flex flex-col min-h-[300px]"
		>
			<img
				src={listing.image || "https://placehold.co/150"}
				alt={listing.title}
				className="w-full"
			/>
			<div className="p-4 flex flex-col h-full">
				<h2 className="text-xl font-bold">{listing.title}</h2>
				<h3 className="text-lg text-gray-500">{listing.sub_title}</h3>
				<h4 className="text-sm italic pb-2">{listing.category}</h4>
				<p>{listing.listing_description}</p>
				<span className="text-sm mt-auto">
					{listing.reserve_price == null
						? "No reserve"
						: listing.listing_price > listing.reserve_price
							? "Reserve met"
							: "Reserve not met"}{" "}
					{listing.listing_price}
				</span>
			</div>
		</Link>
	);
}
