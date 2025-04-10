import { Link } from "@tanstack/react-router";
import type { Listing } from "~/models";

interface ListingTileProps {
	listing: Listing;
	basePath: string;
}

export default function ListingTile({ listing, basePath }: ListingTileProps) {
	if (listing == null) return null;
	const lPrice = Number(listing.listingPrice);
	const rPrice = Number(listing.reservePrice);
	return (
		<Link
			to={`${basePath}/${listing.id}`}
			className="border border-gray-300 rounded-lg overflow-hidden flex flex-col min-h-[300px]"
		>
			<img
				src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
				alt={listing.title}
				className="w-full imagePlaceholder"
			/>
			<div className="p-4 flex flex-col h-full">
				<h2 className="text-xl font-bold">{listing.title}</h2>
				<h3 className="text-base italic pb-2">{listing.subTitle}</h3>
				<p className="pb-2">{listing.description}</p>
				<span className="text-sm mt-auto">
					<span className="block">
						{lPrice === 0
							? "No reserve"
							: lPrice > rPrice
								? "Reserve met"
								: "Reserve not met"}
					</span>

					<span className="block italic">
						{lPrice.toLocaleString(undefined, {
							style: "currency",
							currency: "USD",
						})}
					</span>
				</span>
			</div>
		</Link>
	);
}
