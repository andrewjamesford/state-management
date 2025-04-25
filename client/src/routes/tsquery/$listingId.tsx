import { useMutation, useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import { addDays } from "date-fns";
import { useState } from "react";
import api from "~/api";
import ErrorMessage from "~/components/errorMessage";
import Loader from "~/components/loader";
import ListingForm from "~/forms/listingForm";
import { type Listing, listingDefault } from "~/models";

export const Route = createFileRoute("/tsquery/$listingId")({
	component: RouteComponent,
});

const today = new Date();
const tomorrow = new Date(addDays(today, 1));
const fortnight = new Date(addDays(today, 14));

/**
 * React component that renders a form to update listing details.
 *
 * @returns {JSX.Element} The rendered listing update form.
 *
 * @example
 * // Usage within a routed component:
 * <RouteComponent />
 *
 * @remarks
 * - The form dynamically fetches and displays listing, category, and sub-category data.
 * - Uses local state to manage form inputs in sync with external API data.
 * - On submission, the updateListing mutation is invoked and the user is navigated on successful update.
 */
function RouteComponent() {
	const navigate = useNavigate({
		from: Route.fullPath,
	});

	const { listingId } = useParams({ from: Route.id });

	const {
		data: listingData,
		isLoading: loadingListing,
		error: listingError,
	} = useQuery({
		queryKey: ["listingData", listingId],
		queryFn: async () => {
			const response = await api.getListing(Number(listingId)); // pass id as number
			if (!response) {
				throw new Error(`Error retrieving listing ${listingId}`);
			}
			const result = await response;
			if (!result) {
				throw new Error(`Error retrieving listing ${listingId}`);
			}
			return result;
		},
		enabled: !Number.isNaN(listingId),
	});

	const [formState, setFormState] = useState<Listing>(listingDefault);

	// Update formState when listingData changes
	if (listingData && formState.id !== listingData.id) {
		setFormState({
			...listingData,
			endDate: new Date(listingData.endDate),
			listingPrice: Number(listingData.listingPrice),
			reservePrice: Number(listingData.reservePrice),
		});
	}

	const {
		data: categoryData,
		isLoading: loadingCategory,
		error: categoryError,
	} = useQuery({
		queryKey: ["parentCategories"],
		queryFn: async () => {
			const response = await api.getCategories();
			if (!response) throw new Error("Error retrieving categories");
			const result = response;
			if (!result) throw new Error("Error retrieving categories");
			return result ?? [];
		},
	});

	const {
		data: subCategoryData,
		isLoading: loadingSubCategory,
		error: subCategoryError,
	} = useQuery({
		queryKey: ["subCategories", formState.categoryId],
		queryFn: async () => {
			if (!formState.categoryId) return [];
			const response = await api.getCategories(formState.categoryId);
			if (!response) throw new Error("Error retrieving sub-categories");
			const result = await response;
			return result ?? [];
		},
		enabled: !!formState.categoryId,
	});

	// Add mutation hook for updating the listing
	const updateListingMutation = useMutation({
		mutationFn: async (listing: Listing) => {
			const updatedListing: Listing = {
				...listing,
				endDate: listing.endDate,
				listingPrice: listing.listingPrice,
				reservePrice: listing.reservePrice,
			};
			const response = await api.updateListing(
				Number(listingId),
				updatedListing,
			);
			if (!response) throw new Error("Error updating listing");
			const result = await response;
			if (!result) throw new Error("No result returned from update");
			return result;
		},
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		updateListingMutation.mutate(formState, {
			onSuccess: (result) => {
				if (result) {
					navListings();
					return;
				}
				alert("Update successful.");
			},
			onError: (error) => {
				alert(`Error: ${error.message}`);
			},
		});
	};

	const navListings = () => {
		return navigate({ to: "/tsquery" });
	};

	if (categoryError)
		return (
			<ErrorMessage message={categoryError?.message || "An error occurred"} />
		);
	if (subCategoryError)
		return (
			<ErrorMessage
				message={subCategoryError?.message || "An error occurred"}
			/>
		);
	if (listingError)
		return (
			<ErrorMessage message={listingError?.message || "An error occurred"} />
		);
	if (loadingListing || loadingSubCategory || loadingCategory)
		return <Loader height={50} width={50} />;

	return (
		<form onSubmit={handleSubmit} className="group max-w-4xl mx-auto px-4 py-5">
			<ListingForm
				listingId={Number(listingId)}
				formState={formState}
				setFormState={setFormState}
				minDate={tomorrow}
				maxDate={fortnight}
				loadingCategory={loadingCategory}
				loadingSubCategory={loadingSubCategory}
				categoryData={categoryData ?? null}
				subCategoryData={subCategoryData ?? null}
			/>
		</form>
	);
}
