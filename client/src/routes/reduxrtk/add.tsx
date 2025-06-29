import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { addDays, format } from "date-fns";
import { useState } from "react";
import { useDispatch } from "react-redux";
import ErrorMessage from "~/components/errorMessage";
import Loader from "~/components/loader";
import ListingForm from "~/forms/listingForm";
import type { Category, Listing } from "~/models";
import {
	useAddListingMutation,
	useGetParentCategoriesQuery,
	useGetSubCategoriesQuery,
} from "~/store/reduxrtk/listingApi";
import { resetState } from "~/store/reduxrtk/listingSlice";

// RTK Query error type
interface ApiError {
	data?: { message: string };
	status?: number;
	message: string;
}

export const Route = createFileRoute("/reduxrtk/add")({
	component: RouteComponent,
});

// Add initial state types and values
const initialState: Listing = {
	id: 0,
	title: "",
	subTitle: "",
	categoryId: 0,
	subCategoryId: 0,
	endDate: new Date(),
	condition: false,
	description: "",
	listingPrice: 0,
	reservePrice: 0,
	creditCardPayment: false,
	bankTransferPayment: false,
	bitcoinPayment: false,
	pickUp: false,
	shippingOption: "post",
};

function RouteComponent() {
	const dispatch = useDispatch();
	const navigate = useNavigate({ from: Route.fullPath });

	const today = new Date();
	const tomorrow = new Date(addDays(today, 1));
	const fortnight = new Date(addDays(today, 14));

	const [formState, setFormState] = useState<Listing>({
		...initialState,
		endDate: tomorrow,
	});

	const [addListing] = useAddListingMutation();

	const {
		data: categoryData = [] as Category[],
		isLoading: loadingCategory,
		error: parentError,
	} = useGetParentCategoriesQuery();

	const {
		data: subCategoryData = [] as Category[],
		isLoading: loadingSubCategory,
		error: subCatError,
	} = useGetSubCategoriesQuery(formState.categoryId || 0);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!formState) {
			alert("Form state is not defined.");
			return;
		}

		try {
			const listingToAdd = {
				...formState,
				endDate: format(formState.endDate, "yyyy-MM-dd"),
				listingPrice: String(formState.listingPrice),
				reservePrice: String(formState.reservePrice),
			};
			const response = await addListing({
				// biome-ignore lint/suspicious/noExplicitAny: simplified for demo
				listing: listingToAdd as any,
			}).unwrap();
			if (response === 1) {
				dispatch(resetState());
				navigate({ to: "/reduxrtk" });
			}
		} catch (err) {
			const error = err as ApiError;
			alert(error.data?.message || error.message || "An error occurred");
		}
	};

	if (parentError)
		return (
			<ErrorMessage
				message={
					(parentError as ApiError).data?.message || "Error loading categories"
				}
			/>
		);
	if (subCatError)
		return (
			<ErrorMessage
				message={
					(subCatError as ApiError).data?.message ||
					"Error loading sub-categories"
				}
			/>
		);
	if (loadingCategory) return <Loader height={50} width={50} />;

	return (
		<form onSubmit={handleSubmit} className="group max-w-4xl mx-auto px-4 py-5">
			<ListingForm
				listingId={0}
				formState={formState}
				setFormState={setFormState}
				minDate={tomorrow}
				maxDate={fortnight}
				loadingCategory={loadingCategory}
				loadingSubCategory={loadingSubCategory}
				categoryData={categoryData}
				subCategoryData={subCategoryData}
			/>
		</form>
	);
}
