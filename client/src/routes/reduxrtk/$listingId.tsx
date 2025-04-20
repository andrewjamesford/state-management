import {
	createFileRoute,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import { addDays, format } from "date-fns";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ErrorMessage from "~/components/errorMessage";
import Loader from "~/components/loader";
import ListingForm from "~/forms/listingForm";
import { type Listing, type ListingSchema, listingSchema } from "~/models";
import type { RootState } from "~/store";
import {
	useGetListingQuery,
	useGetParentCategoriesQuery,
	useGetSubCategoriesQuery,
	useUpdateListingMutation,
} from "~/store/listingApi";

// RTK Query error type
interface ApiError {
	data?: { message: string };
	status?: number;
	message: string;
}

export const Route = createFileRoute("/reduxrtk/$listingId")({
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
	const [formState, setFormState] = useState<ListingSchema>(() => ({
		...reduxListing,
		endDate: new Date(reduxListing.endDate),
		listingPrice: Number(reduxListing.listingPrice),
		reservePrice: Number(reduxListing.reservePrice),
	}));

	const { listingId } = useParams({ from: Route.id });

	const [updateListing] = useUpdateListingMutation();

	const {
		data: listingData,
		isLoading: loadingListing,
		error: listingError,
	} = useGetListingQuery(listingId);

	const {
		data: categoryData,
		isLoading: loadingCategory,
		error: categoryError,
	} = useGetParentCategoriesQuery();

	const {
		data: subCategoryData,
		isLoading: loadingSubCategory,
		error: subCategoryError,
	} = useGetSubCategoriesQuery(formState.categoryId || 0);

	useEffect(() => {
		if (listingData) {
			setFormState({
				...listingData,
				endDate: new Date(listingData.endDate),
				listingPrice: Number(listingData.listingPrice),
				reservePrice: Number(listingData.reservePrice),
			});
		}
	}, [listingData]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const updatedListing: Listing = {
				...formState,
				endDate: format(formState.endDate, "yyyy-MM-dd"),
				listingPrice: String(formState.listingPrice),
				reservePrice: String(formState.reservePrice),
			};
			const result = await updateListing({
				id: listingId,
				listing: updatedListing,
			}).unwrap();

			if (result === 1) {
				navigate({ to: "/reduxrtk" });
			}
		} catch (err) {
			const error = err as ApiError;
			alert(error.data?.message || error.message || "An error occurred");
		}
	};

	if (categoryError)
		return (
			<ErrorMessage
				message={
					(categoryError as ApiError)?.data?.message ||
					(categoryError as ApiError)?.message ||
					"An error occurred"
				}
			/>
		);
	if (subCategoryError)
		return (
			<ErrorMessage
				message={
					(subCategoryError as ApiError)?.data?.message ||
					(subCategoryError as ApiError)?.message ||
					"An error occurred"
				}
			/>
		);
	if (listingError)
		return (
			<ErrorMessage
				message={
					(listingError as ApiError)?.data?.message ||
					(listingError as ApiError)?.message ||
					"An error occurred"
				}
			/>
		);
	if (loadingListing) return <Loader height={50} width={50} />;

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
