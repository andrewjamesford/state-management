import {
	createFileRoute,
	useParams,
	useNavigate,
} from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addDays, format } from "date-fns";
import type { RootState } from "~/store";
import {
	useGetListingQuery,
	useUpdateListingMutation,
	useGetParentCategoriesQuery,
	useGetSubCategoriesQuery,
} from "~/store/listingApi";
import { type Listing, type Category, listingSchema } from "~/models";
import Loader from "~/components/loader";

import ErrorMessage from "~/components/errorMessage";
import ListingForm from "~/forms/listingForm";

export const Route = createFileRoute("/redux/$listingId")({
	component: RouteComponent,
});

/**
 * @fileoverview
 * This file defines a React component that renders a form for viewing and updating a listing's details.
 *
 * The component integrates with Redux and Tanstack Router to:
 * - Retrieve the current listing information from the Redux store or API.
 * - Fetch supporting data such as parent categories and sub-categories using RTK Query hooks.
 * - Manage local form state for inputs such as title, subtitle, description, pricing, and shipping options.
 * - Provide various UI controls (TextInput, Select, RadioButton, Checkbox, etc.) for user interactions.
 * - Handle form submission by invoking an update mutation and navigate back to the listings overview on success.
 *
 * @remarks
 * - The component initializes its state from the Redux store, defaulting to a schema if no listing exists.
 * - URL parameters (e.g., listingId) are used to fetch specific listing details.
 * - Client-side validation and error handling ensure robust form interactions.
 *
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

	const navigate = useNavigate({ from: Route.fullPath });

	// Get initial state from Redux
	const reduxListing = useSelector((state: RootState) =>
		state.listing ? state.listing : listingSchema,
	);

	// Local state for form
	const [formState, setFormState] = useState(reduxListing);

	const { listingId } = useParams({ from: Route.id });

	const [updateListing] = useUpdateListingMutation();

	const {
		data: listingData,
		isLoading: loadingListing,
		isError: listingError,
	} = useGetListingQuery(listingId);

	const {
		data: categoryData,
		isLoading: loadingCategory,
		isError: categoryError,
	} = useGetParentCategoriesQuery();

	const {
		data: subCategoryData,
		isLoading: loadingSubCategory,
		isError: subCategoryError,
	} = useGetSubCategoriesQuery(formState.categoryId || 0);

	useEffect(() => {
		if (listingData) {
			setFormState(listingData);
		}
	}, [listingData]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const result = await updateListing({
				id: listingId,
				listing: formState,
			}).unwrap();
			if (result?.message) {
				alert(result?.message);
			}
			if (result === 1) {
				navigate({ to: "/redux" });
			}
		} catch (error) {
			alert(error instanceof Error ? error.message : "An error occurred");
		}
	};

	if (categoryError)
		return <ErrorMessage message="Error: Error loading Categories" />;
	if (subCategoryError)
		return <ErrorMessage message="Error: Error loading Sub-Categories" />;
	if (listingError) return <ErrorMessage message="Failed to load listing" />;
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
