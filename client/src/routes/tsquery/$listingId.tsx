import { useMutation, useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import { addDays, format, isWithinInterval } from "date-fns";
import { useEffect, useState } from "react";
import api from "~/api";
import ErrorMessage from "~/components/errorMessage";
import Loader from "~/components/loader";
import ListingForm from "~/forms/listingForm";
import { type Listing, listingDefault } from "~/models";

export const Route = createFileRoute("/tsquery/$listingId")({
	component: RouteComponent,
});

/**
 * @fileoverview
 * A React component for editing listing details.
 * Uses TanStack Router for routing and TanStack Query for data management.
 *
 * Features:
 * - Loads and displays existing listing data for editing
 * - Manages form state for title/category, item details, price/payment, and shipping
 * - Handles category/subcategory selection with dynamic loading
 * - Validates dates within allowed range
 * - Supports multiple payment methods
 * - Handles shipping and pickup options
 *
 * @remarks
 * The component uses several custom form components:
 * - TextInput for text fields
 * - Select for category dropdowns
 * - DateInput for date selection
 * - Textarea for description
 * - MoneyTextInput for prices
 * - RadioButton for binary choices
 * - Checkbox for multiple selections
 *
 * Form data is validated and submitted via mutation to update the formState.
 * On successful update, user is redirected to listings page.
 * @module RouteComponent
 */

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
	const today = new Date();
	const tomorrow = format(addDays(today, 1), "yyyy-MM-dd");
	const fortnight = format(addDays(today, 14), "yyyy-MM-dd");

	const navigate = useNavigate({
		from: Route.fullPath,
	});

	// Local state for form
	const [formState, setFormState] = useState(listingDefault);

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
	});

	useEffect(() => {
		if (listingData) {
			const newEndDate = new Date(listingData.endDate);
			const isValidDate = isWithinInterval(newEndDate, {
				start: new Date(tomorrow),
				end: new Date(fortnight),
			});

			const endDate = isValidDate ? newEndDate : new Date(tomorrow);

			setFormState((prev) => ({
				...prev,
				title: listingData.title,
				subTitle: listingData.subTitle,
				endDate,
				categoryId: listingData?.categoryId,
				subCategoryId: listingData?.subCategoryId,
				description: listingData.description,
				condition: listingData.condition,
				listingPrice: listingData.listingPrice,
				reservePrice: listingData.reservePrice || 0,
				creditCardPayment: listingData.creditCardPayment,
				bankTransferPayment: listingData.bankTransferPayment,
				bitcoinPayment: listingData.bitcoinPayment,
				pickUp: listingData.pickUp,
				shippingOption: listingData.shippingOption,
			}));
		}
	}, [listingData, tomorrow, fortnight]);

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
				tomorrow={tomorrow}
				fortnight={fortnight}
				loadingCategory={loadingCategory}
				loadingSubCategory={loadingSubCategory}
				categoryData={categoryData ?? null}
				subCategoryData={subCategoryData ?? null}
			/>
		</form>
	);
}
