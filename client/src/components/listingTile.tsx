import { Link } from "@tanstack/react-router";
import type { Listing } from "~/models";

interface ListingTileProps {
	listing: NonNullable<Listing>;
	basePath: string;
}

export default function ListingTile({ listing, basePath }: ListingTileProps) {
	if (listing == null) return null;
	console.log("ListingTile", listing);
	const lPrice = Number(listing.listingPrice);
	const rPrice = Number(listing.reservePrice);
	const formatCurrency = (amount: number) =>
		amount.toLocaleString(undefined, { style: "currency", currency: "NZD" });
	const linkPath = `${basePath}/${listing?.id}`.toString();
	return (
		<Link
			to={linkPath}
			className="border border-gray-300 rounded-lg overflow-hidden flex flex-col min-h-[300px]"
		>
			{/* Transparent png 1x1 pixel. CSS colours img tag */}
			<img
				src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
				alt={listing.title}
				className="w-full h-60 imagePlaceholder"
				aria-label={listing.title}
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

					<span className="block italic">{formatCurrency(lPrice)}</span>
				</span>
			</div>
		</Link>
	);
}
