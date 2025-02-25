import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import ListingTile from "~/components/listingTile";
import Loader from "~/components/loader";
import ErrorMessage from "~/components/errorMessage";
import { useListingStore } from "~/store/listingStore";

export const Route = createFileRoute("/zustand/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { listings, isLoading, error, fetchListings } = useListingStore();

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  if (error) return <ErrorMessage message={error} />;
  if (isLoading) return <Loader height={50} width={50} />;

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <ListingTile
            key={listing.id}
            listing={listing}
            basePath="/zustand"
          />
        ))}
      </div>
    </div>
  );
}