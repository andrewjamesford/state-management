import {
	createFileRoute,
	useParams,
	useNavigate,
} from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addDays, format } from "date-fns";
import type { RootState } from "~/store";
import {
	setTitleCategory,
	setItemDetails,
	setPricePayment,
	setShipping,
} from "~/store/listingSlice";
import {
	useGetListingQuery,
	useUpdateListingMutation,
	useGetParentCategoriesQuery,
	useGetSubCategoriesQuery,
} from "~/store/listingApi";
import type { Listing } from "~/models";
import Loader from "~/components/loader";
import type { ListingState } from "~/types/listing";
import RadioButton from "~/components/radioButton";
import DateInput from "~/components/dateInput";
import TextInput from "~/components/textInput";
import Select from "~/components/select";
import Textarea from "~/components/textarea";
import MoneyTextInput from "~/components/moneyTextInput";
import Checkbox from "~/components/Checkbox";

export const Route = createFileRoute("/redux/$listingId")({
	component: RouteComponent,
});

// Add initial state types and values
const initialState: Listing = {
	titleCategory: {
		id: 0,
		title: "Inital Title",
		subTitle: "",
		categoryId: 0,
		subCategoryId: 0,
		endDate: "",
	},
	itemDetails: {
		condition: false,
		description: "",
	},
	pricePayment: {
		listingPrice: "",
		reservePrice: "",
		creditCardPayment: false,
		bankTransferPayment: false,
		bitcoinPayment: false,
	},
	shipping: {
		pickUp: false,
		shippingOption: "",
	},
};

function RouteComponent() {
	const dispatch = useDispatch();
	const navigate = useNavigate({ from: Route.fullPath });
	const { listingId } = useParams({ from: Route.id });
	const listing =
		useSelector((state: RootState) => state.listing) || initialState;

	const { titleCategory, itemDetails, pricePayment, shipping } = listing;

	const today = new Date();
	const tomorrow = format(addDays(today, 1), "yyyy-MM-dd");
	const fortnight = format(addDays(today, 14), "yyyy-MM-dd");

	const { data: listingData, isLoading: loadingListing } =
		useGetListingQuery(listingId);
	const { data: parentCatData, isLoading: loadingCategory } =
		useGetParentCategoriesQuery();
	const { data: subCatData, isLoading: loadingSubCategory } =
		useGetSubCategoriesQuery(titleCategory.categoryId || 0);
	const [updateListing] = useUpdateListingMutation();

	useEffect(() => {
		console.log("listingData", listingData);
		if (listingData && !loadingListing) {
			dispatch(
				setTitleCategory({
					title: listingData?.title,
					subTitle: listingData.subtitle,
					categoryId: listingData.categoryid,
					subCategoryId: listingData.subcategoryid,
					endDate: listingData.enddate,
				}),
			);
			dispatch(
				setItemDetails({
					condition: listingData.condition,
					description: listingData.listingdescription,
				}),
			);
			dispatch(
				setPricePayment({
					listingPrice: listingData.listingprice,
					reservePrice: Number(listingData.reserveprice),
					creditCardPayment: listingData.creditcardpayment,
					bankTransferPayment: listingData.banktransferpayment,
					bitcoinPayment: listingData.bitcoinpayment,
				}),
			);
			dispatch(
				setShipping({
					pickUp: listingData.pickup,
					shippingOption: listingData.shippingoption,
				}),
			);
		}
	}, [listingData, loadingListing, dispatch]);

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
			const result = await updateListing({ id: listingId, listing }).unwrap();
			if (result === 1) {
				navigate({ to: "/redux" });
			}
		} catch (error) {
			alert(error instanceof Error ? error.message : "An error occurred");
		}
	};

	if (loadingListing) return <Loader />;

	return (
		<form onSubmit={handleSubmit}>
			<h1 className="mt-4 text-2xl font-bold">What are you listing?</h1>

			<div className="mt-6">
				{/* Listing Title */}
				<TextInput
					labelClassName="block text-sm font-medium text-gray-700"
					label="Listing title"
					id="listing-title"
					placeholder="e.g. iPhone 5c, Red t-shirt"
					value={titleCategory.title}
					onChange={(e) => {
						const value = e.target.value ?? "";
						setTitleCategory({
							...titleCategory,
							title: value,
						});
					}}
					required={true}
					maxLength={80}
					minLength={3}
					className="peer mt-1 block w-full rounded-md border px-3 py-2 placeholder:italic invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-600"
					errorMessage="Please enter a listing title of 3-80 characters"
					errorClassName="mt-1 hidden text-sm text-red-600 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block"
					requirementsLabel="80 characters max"
					requirementsClassName="mt-1 text-sm text-gray-500"
				/>
			</div>

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
