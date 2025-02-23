import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { addDays, format } from "date-fns";
import type { RootState } from "~/store";
import { setListing, resetState } from "~/store/listingSlice";
import {
	useAddListingMutation,
	useGetParentCategoriesQuery,
	useGetSubCategoriesQuery,
} from "~/store/listingApi";
import type { Listing } from "~/models";
import Loader from "~/components/loader";
import ErrorMessage from "~/components/errorMessage";
import ListingForm from "~/forms/listingForm";

export const Route = createFileRoute("/redux/add")({
	component: RouteComponent,
});

// Add initial state types and values
const initialState: Listing = {
	id: 0,
	title: "",
	subTitle: "",
	categoryId: 0,
	subCategoryId: 0,
	endDate: "",
	condition: false,
	description: "",
	listingPrice: "",
	reservePrice: "",
	creditCardPayment: false,
	bankTransferPayment: false,
	bitcoinPayment: false,
	pickUp: false,
	shippingOption: "",
};

function RouteComponent() {
	const dispatch = useDispatch();
	const navigate = useNavigate({ from: Route.fullPath });

	const [formState, setFormState] = useState<Listing>(initialState);

	const today = new Date();
	const tomorrow = format(addDays(today, 1), "yyyy-MM-dd");
	const fortnight = format(addDays(today, 14), "yyyy-MM-dd");

	const [addListing] = useAddListingMutation();

	const {
		data: categoryData,
		isLoading: loadingCategory,
		isError: parentError,
	} = useGetParentCategoriesQuery();
	const {
		data: subCategoryData,
		isLoading: loadingSubCategory,
		isError: subCatError,
	} = useGetSubCategoriesQuery(formState.categoryId || 0);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!formState) {
			alert("Form state is not defined.");
			return;
		}

		try {
			const result = await addListing({ listing: formState }).unwrap();
			if (result === 1) {
				dispatch(resetState());
				navigate({ to: "/redux" });
			}
		} catch (error) {
			alert(error instanceof Error ? error.message : "An error occurred");
		}
	};

	if (parentError)
		return <ErrorMessage message="Error: Error loading Categories" />;
	if (subCatError)
		return <ErrorMessage message="Error: Error loading Sub-Categories" />;
	if (loadingCategory) return <Loader height={50} width={50} />;

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
