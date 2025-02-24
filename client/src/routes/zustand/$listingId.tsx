import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { addDays, format } from "date-fns";
import { type ListingSchema, listingSchema } from "~/models";
import { useListingStore } from "~/store/listingStore";
import Loader from "~/components/loader";
import ErrorMessage from "~/components/errorMessage";
import ListingForm from "~/forms/listingForm";

export const Route = createFileRoute("/zustand/$listingId")({
  component: RouteComponent,
});

function RouteComponent() {
  const today = new Date();
  const tomorrow = format(addDays(today, 1), "yyyy-MM-dd");
  const fortnight = format(addDays(today, 14), "yyyy-MM-dd");

  const navigate = useNavigate({ from: Route.fullPath });
  const { listingId } = useParams({ from: Route.id });

  const { 
    listing, 
    categories, 
    subCategories,
    isLoading, 
    error,
    fetchListing, 
    fetchCategories, 
    fetchSubCategories,
    updateListing 
  } = useListingStore();

  // Local state for form
  const [formState, setFormState] = useState<ListingSchema>(() => ({
    ...listingSchema,
    endDate: new Date(tomorrow)
  }));

  useEffect(() => {
    if (listingId !== 'new') {
      fetchListing(listingId);
    }
    fetchCategories();
  }, [listingId, fetchListing, fetchCategories]);

  useEffect(() => {
    if (formState.categoryId) {
      fetchSubCategories(formState.categoryId);
    }
  }, [formState.categoryId, fetchSubCategories]);

  useEffect(() => {
    if (listing && listingId !== 'new') {
      setFormState({
        ...listing,
        endDate: listing.endDate ? new Date(listing.endDate) : new Date(tomorrow),
        listingPrice: Number(listing.listingPrice),
        reservePrice: Number(listing.reservePrice)
      });
    }
  }, [listing, listingId, tomorrow]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateListing(listingId, {
        ...formState,
        endDate: formState.endDate,
        listingPrice: formState.listingPrice,
        reservePrice: formState.reservePrice
      });
      navigate({ to: "/zustand" });
    } catch (error) {
      console.error('Failed to update listing:', error);
    }
  };

  if (error) return <ErrorMessage message={error} />;
  if (isLoading) return <Loader height={50} width={50} />;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-5">
      <ListingForm
        listingId={Number(listingId)}
        formState={formState}
        setFormState={setFormState}
        tomorrow={tomorrow}
        fortnight={fortnight}
        loadingCategory={isLoading}
        loadingSubCategory={isLoading}
        categoryData={categories}
        subCategoryData={subCategories}
      />
    </form>
  );
}