import {
	createFileRoute,
	useParams,
	useNavigate,
} from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { addDays, format, isWithinInterval } from "date-fns";
import { useEffect, useState } from "react";
import { type Listing, type Category, listingSchema } from "~/models";
import api from "~/api";
import Loader from "~/components/loader";

import ErrorMessage from "~/components/errorMessage";
import ListingForm from "~/forms/listingForm";

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
	const [formState, setFormState] = useState(listingSchema);

	const { listingId } = useParams({ from: Route.id });

	const {
		data: listingData,
		isLoading: loadingListing,
		error: listingError,
	} = useQuery({
		queryKey: ["listingData", listingId],
		queryFn: async () => {
			const response = await api.getListing(String(listingId)); // pass id as string
			if (!response.ok) {
				throw new Error(`Error retrieving listing ${listingId}`);
			}
			return await response.json();
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
			if (!response.ok) throw new Error("Error retrieving categories");
			const result = await response.json();
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
			if (!response.ok) throw new Error("Error retrieving sub-categories");
			return await response.json();
		},
	});

	useEffect(() => {
		if (listingData) {
			const isValidDate: boolean = isWithinInterval(
				new Date(listingData.enddate),
				{
					start: tomorrow,
					end: fortnight,
				},
			);
			const newEndDate = isValidDate
				? format(listingData.enddate, "yyyy-MM-dd")
				: format(tomorrow, "yyyy-MM-dd");

			setFormState((prev) => ({
				...prev,
				title: listingData.title,
				subTitle: listingData.subtitle,
				endDate: newEndDate,
				categoryId: listingData?.categoryid,
				subCategoryId: listingData?.subcategoryid,
				description: listingData.listingdescription,
				condition: listingData.condition,
				listingPrice: listingData.listingprice,
				reservePrice: listingData.reserveprice,
				creditCardPayment: listingData.creditcardpayment,
				bankTransferPayment: listingData.banktransferpayment,
				bitcoinPayment: listingData.bitcoinpayment,
				pickUp: listingData.pickup,
				shippingOption: listingData.shippingoption,
			}));
		}
	}, [loadingListing, listingData]);

	// Add mutation hook for updating the listing
	const updateListingMutation = useMutation({
		mutationFn: async (listing: Listing) => {
			if (formState.reservePrice === "") formState.reservePrice = "0.00";
			const response = await api.updateListing(listingId, listing);
			if (!response.ok) {
				throw new Error("Error updating listing");
			}
			const result = await response.json();
			if (result.error) {
				throw new Error(result.error);
			}
			return result;
		},
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		updateListingMutation.mutate(formState, {
			onSuccess: (result) => {
				alert(`${JSON.stringify(result)} listing updated`);
				if (result === 1) {
					navListings();
				}
			},
			onError: (error: Error) => {
				alert(error.message);
			},
		});
	};

	const navListings = () => {
		return navigate({ to: "/tsquery" });
	};

	if (categoryError) return <ErrorMessage message={categoryError.message} />;
	if (subCategoryError)
		return <ErrorMessage message={subCategoryError.message} />;
	if (listingError) return <ErrorMessage message={listingError.message} />;
	if (loadingListing) return <Loader height={50} width={50} />;

	return (
		<form onSubmit={handleSubmit} noValidate className="group">
			<ListingForm
				listingId={0}
				formState={formState}
				setFormState={setFormState}
				today={today}
				tomorrow={tomorrow}
				fortnight={fortnight}
				loadingCategory={loadingCategory}
				loadingSubCategory={loadingSubCategory}
				categoryData={categoryData}
				subCategoryData={subCategoryData}
			/>
		</form>
	);
}
