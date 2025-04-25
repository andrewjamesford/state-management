import {
	createFileRoute,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import { addDays } from "date-fns";
import { useEffect, useState } from "react";
import ErrorMessage from "~/components/errorMessage";
import Loader from "~/components/loader";
import ListingForm from "~/forms/listingForm";
import { type Listing, listingDefault } from "~/models";
import { useListingStore } from "~/store/zustand/listingStore";

export const Route = createFileRoute("/zustand/$listingId")({
	component: RouteComponent,
});

function RouteComponent() {
	const today = new Date();
	const tomorrow = new Date(addDays(today, 1));
	const fortnight = new Date(addDays(today, 14));

	const navigate = useNavigate({ from: Route.fullPath });
	const { listingId = 0 } = useParams({ from: Route.id });

	const {
		listing,
		categories,
		subCategories,
		isLoading,
		error,
		fetchListing,
		fetchCategories,
		fetchSubCategories,
		updateListing,
	} = useListingStore();

	// Local state for form
	const [formState, setFormState] = useState<Listing>(() => listingDefault);

	useEffect(() => {
		if (listingId !== "new") {
			fetchListing(listingId as number);
		}
		fetchCategories();
	}, [listingId, fetchListing, fetchCategories]);

	useEffect(() => {
		if (formState.categoryId) {
			fetchSubCategories(formState.categoryId);
		}
	}, [formState.categoryId, fetchSubCategories]);

	useEffect(() => {
		if (listing && listingId !== "new") {
			setFormState({
				...listing,
				endDate: new Date(listing.endDate),
				listingPrice: Number(listing.listingPrice),
				reservePrice: Number(listing.reservePrice),
				categoryId: listing.categoryId,
				subCategoryId: listing.subCategoryId,
			});
			// Fetch subcategories when listing is loaded
			if (listing.categoryId) {
				fetchSubCategories(listing.categoryId);
			}
		}
	}, [listing, listingId, fetchSubCategories]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await updateListing(listingId as number, {
				...formState,
				endDate: formState.endDate,
				listingPrice: formState.listingPrice,
				reservePrice: formState.reservePrice,
				creditCardPayment: formState.creditCardPayment,
				bankTransferPayment: formState.bankTransferPayment,
				bitcoinPayment: formState.bitcoinPayment,
				pickUp: formState.pickUp,
				shippingOption: formState.shippingOption,
			});
			navigate({ to: "/zustand" });
		} catch (error) {
			console.error("Failed to update listing:", error);
		}
	};

	if (error)
		return (
			<ErrorMessage
				message={
					typeof error === "string"
						? error
						: (error as Error)?.message || "An error occurred"
				}
			/>
		);
	if (isLoading) return <Loader height={50} width={50} />;

	return (
		<form onSubmit={handleSubmit} className="group max-w-4xl mx-auto px-4 py-5">
			<ListingForm
				listingId={listingId as number}
				formState={formState}
				setFormState={setFormState}
				minDate={tomorrow}
				maxDate={fortnight}
				loadingCategory={isLoading}
				loadingSubCategory={isLoading}
				categoryData={categories}
				subCategoryData={subCategories}
			/>
		</form>
	);
}
