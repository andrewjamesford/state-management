import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { addDays, format } from "date-fns";
import type { RootState } from "~/store";
import {
	setTitleCategory,
	setItemDetails,
	setPricePayment,
	setShipping,
	resetState,
} from "~/store/listingSlice";
import {
	useAddListingMutation,
	useGetParentCategoriesQuery,
	useGetSubCategoriesQuery,
} from "~/store/listingApi";
import type { Listing } from "~/models";
import Loader from "~/components/loader";
import RadioButton from "~/components/radioButton";
import DateInput from "~/components/dateInput";
import TextInput from "~/components/textInput";
import Select from "~/components/select";
import Textarea from "~/components/textarea";
import MoneyTextInput from "~/components/moneyTextInput";
import Checkbox from "~/components/Checkbox";

export const Route = createFileRoute("/redux/add")({
	component: RouteComponent,
});

function RouteComponent() {
	const dispatch = useDispatch();
	const navigate = useNavigate({ from: Route.fullPath });
	const { titleCategory, itemDetails, pricePayment, shipping } = useSelector(
		(state: RootState) => state.listing,
	);

	const today = new Date();
	const tomorrow = format(addDays(today, 1), "yyyy-MM-dd");
	const fortnight = format(addDays(today, 14), "yyyy-MM-dd");

	const [addListing] = useAddListingMutation();
	const { data: parentCatData, isLoading: loadingCategory } =
		useGetParentCategoriesQuery();
	const { data: subCatData, isLoading: loadingSubCategory } =
		useGetSubCategoriesQuery(titleCategory.categoryId || 0);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const listing: Listing = {
			titleCategory,
			itemDetails,
			pricePayment: {
				...pricePayment,
				reservePrice: pricePayment.reservePrice || "0.00",
			},
			shipping,
		};

		try {
			const result = await addListing({ listing }).unwrap();
			if (result === 1) {
				dispatch(resetState());
				navigate({ to: "/redux" });
			}
		} catch (error) {
			alert(error instanceof Error ? error.message : "An error occurred");
		}
	};

	// ... Rest of the component remains similar but using Redux dispatch instead of setState
	// Here's a sample of the changes:

	return (
		<form onSubmit={handleSubmit} noValidate className="group">
			<h1 className="mt-4 text-2xl font-bold">What are you listing?</h1>

			<div className="mt-6">
				<TextInput
					labelClassName="block text-sm font-medium text-gray-700"
					label="Listing title"
					id="listing-title"
					placeholder="e.g. iPhone 5c, Red t-shirt"
					value={titleCategory.title}
					onChange={(e) => {
						dispatch(setTitleCategory({ title: e.target.value }));
					}}
					required={true}
					maxLength={80}
					minLength={3}
					className="peer mt-1 block w-full rounded-md border px-3 py-2 placeholder:italic"
					errorMessage="Please enter a listing title of 3-80 characters"
				/>
			</div>

			{/* ... Rest of the form components following the same pattern ... */}

			<div className="mt-3">
				<SubmitButton />
			</div>
		</form>
	);
}

function SubmitButton() {
	return (
		<button
			type="submit"
			className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-500 hover:bg-blue-600 text-white border border-blue-600 h-10 px-4 py-2"
		>
			Save
		</button>
	);
}
