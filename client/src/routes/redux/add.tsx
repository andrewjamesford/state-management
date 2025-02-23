import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { addDays, format } from "date-fns";
import { resetState } from "~/store/listingSlice";
import {
	useAddListingMutation,
	useGetParentCategoriesQuery,
	useGetSubCategoriesQuery,
} from "~/store/listingApi";
import type { Listing, Category, ListingSchema } from "~/models";
import Loader from "~/components/loader";
import ErrorMessage from "~/components/errorMessage";
import ListingForm from "~/forms/listingForm";

export const Route = createFileRoute("/redux/add")({
	component: RouteComponent,
});

// Add initial state types and values
const initialState: ListingSchema = {
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
	shippingOption: "",
};

function RouteComponent() {
	const dispatch = useDispatch();
	const navigate = useNavigate({ from: Route.fullPath });

	const today = new Date();
	const tomorrow = format(addDays(today, 1), "yyyy-MM-dd");
	const fortnight = format(addDays(today, 14), "yyyy-MM-dd");

	const [formState, setFormState] = useState<ListingSchema>({
		...initialState,
		endDate: new Date(tomorrow)
	});

	const [addListing] = useAddListingMutation();

	const {
		data: categoryData = [] as Category[],
		isLoading: loadingCategory,
		isError: parentError,
	} = useGetParentCategoriesQuery();
	const {
		data: subCategoryData = [] as Category[],
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
			const listingToAdd: Listing = {
				...formState,
				endDate: format(formState.endDate, 'yyyy-MM-dd'),
				listingPrice: String(formState.listingPrice),
				reservePrice: String(formState.reservePrice)
			};
			const response = await addListing({ listing: listingToAdd }).unwrap();
			if (response === 1) {
				dispatch(resetState());
				navigate({ to: "/redux" });
			}
		} catch (err: unknown) {
			const error = err as { data?: { message: string }; message: string };
			alert(error.data?.message || error.message || "An error occurred");
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
