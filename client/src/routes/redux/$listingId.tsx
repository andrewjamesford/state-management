import {
	createFileRoute,
	useParams,
	useNavigate,
} from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addDays, format } from "date-fns";
import type { RootState } from "~/store";

import {
	useGetListingQuery,
	useUpdateListingMutation,
	useGetParentCategoriesQuery,
	useGetSubCategoriesQuery,
} from "~/store/listingApi";
import { type Category, type Listing, listingSchema } from "~/models";
import Loader from "~/components/loader";
import type { ListingState } from "~/types/listing";
import RadioButton from "~/components/radioButton";
import DateInput from "~/components/dateInput";
import TextInput from "~/components/textInput";
import Select from "~/components/select";
import Textarea from "~/components/textarea";
import MoneyTextInput from "~/components/moneyTextInput";
import Checkbox from "~/components/Checkbox";
import ErrorMessage from "~/components/errorMessage";

export const Route = createFileRoute("/redux/$listingId")({
	component: RouteComponent,
});

// Add initial state types and values

function RouteComponent() {
	const navigate = useNavigate({ from: Route.fullPath });
	const { listingId } = useParams({ from: Route.id });

	const [updateListing] = useUpdateListingMutation();

	// Get initial state from Redux
	const reduxListing = useSelector((state: RootState) =>
		state.listing ? state.listing : listingSchema,
	);

	// Local state for form
	const [formState, setFormState] = useState(reduxListing);

	const today = new Date();
	const tomorrow = format(addDays(today, 1), "yyyy-MM-dd");
	const fortnight = format(addDays(today, 14), "yyyy-MM-dd");

	const {
		data: listingData,
		isLoading: loadingListing,
		isError: loadingError,
	} = useGetListingQuery(listingId);

	const { data: parentCatData, isLoading: loadingCategory } =
		useGetParentCategoriesQuery();
	const { data: subCatData, isLoading: loadingSubCategory } =
		useGetSubCategoriesQuery(formState.categoryId || 0);

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
			if (result === 1) {
				navigate({ to: "/redux" });
			}
		} catch (error) {
			alert(error instanceof Error ? error.message : "An error occurred");
		}
	};

	if (loadingListing) return <Loader />;
	if (loadingError) return <ErrorMessage message="Failed to load listing" />;

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
					value={formState.title}
					onChange={(e) => {
						const value = e.target.value ?? "";
						setFormState((prev) => ({
							...prev,
							title: value,
						}));
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

			<div className="mt-6">
				{/* Subtitle */}
				<TextInput
					labelClassName="block text-sm font-medium text-gray-700"
					label="Subtitle (optional)"
					id="sub-title"
					placeholder="e.g. iPhone 5c, Red t-shirt"
					value={formState.subTitle}
					onChange={(e) => {
						const value = e.target.value ?? "";
						setFormState((prev) => ({
							...prev,
							subTitle: value,
						}));
					}}
					maxLength={50}
					className="block w-full px-3 py-2 mt-1 border rounded-md placeholder:italic peer"
					errorMessage="Please enter a listing title of 3-80 characters"
					errorClassName="mt-1 hidden text-sm text-red-600 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block"
					requirementsLabel="50 characters max"
					requirementsClassName="mt-1 text-sm text-gray-500"
				/>
			</div>

			<div className="mt-6">
				{/* Category */}
				{loadingCategory && <Loader width={20} height={20} />}

				{!loadingCategory && (
					<Select
						label="Category"
						labelClassName="block text-sm font-medium text-gray-700"
						id="category"
						selectClassName={`block w-full h-10 px-3 py-2 items-center justify-between rounded-md border border-input bg-background ring-offset-background peer ${formState.categoryId === 0 ? " italic text-gray-400" : ""}`}
						onChange={(e) => {
							const value = Number.parseInt(e.target.value) || 0;
							setFormState((prev) => ({
								...prev,
								categoryId: value,
								subCategoryId: 0,
							}));
						}}
						value={formState.categoryId}
						required={true}
						options={[
							{
								value: 0,
								label: "Select a category...",
								className: "text-muted-foreground italic",
							},
							...(parentCatData ?? []).map((category: Category) => ({
								value: category.id,
								label: category.category_name,
							})),
						]}
					/>
				)}
			</div>

			<div className="mt-6">
				{/* Sub Category */}
				{loadingSubCategory && <Loader width={20} height={20} />}

				{!loadingSubCategory && (
					<Select
						label="Sub Category"
						labelClassName="block text-sm font-medium text-gray-700"
						id="category-sub"
						selectClassName={`block w-full h-10 px-3 py-2 items-center justify-between rounded-md border border-input bg-background ring-offset-background peer ${formState.subCategoryId === 0 ? " italic text-gray-400" : ""}`}
						onChange={(e) => {
							const value = Number.parseInt(e.target.value) || 0;
							// setFormState((prev) => ({
							// 	...prev,
							// 	categoryId: { ...prev, subCategoryId: value },
							// }));
						}}
						value={formState.subCategoryId}
						required={true}
						disabled={!subCatData}
						options={[
							{
								value: 0,
								label: "Select a sub category...",
								className: "text-muted-foreground italic",
							},
							...(subCatData ?? []).map((category: Category) => ({
								value: category.id,
								label: category.category_name,
							})),
						]}
					/>
				)}
			</div>

			<div className="mt-6">
				{/* End Date */}
				<DateInput
					label="End date"
					labelClassName="block text-sm font-medium text-gray-700"
					id="end-date"
					value={formState.endDate}
					onChange={(e) =>
						setFormState((prev) => ({
							...prev,
							endDate: e.target.value,
						}))
					}
					required
					pattern="\d{4}-\d{2}-\d{2}"
					min={tomorrow}
					max={fortnight}
					errorClassName="mt-1 hidden text-sm text-red-600 peer-[&:not(:default):invalid]:block"
					error="Please select a future date between tomorrow and two weeks from now"
				/>
			</div>

			<h1 className="mt-4 text-2xl font-bold">Item details</h1>
			<div className="mt-6">
				{/* Description */}
				<Textarea
					label="Description"
					labelClassName="block text-sm font-medium text-gray-700"
					id="listing-description"
					value={formState.description}
					onChange={(e) => {
						const value = e.target.value ?? "";
						setFormState((prev) => ({
							...prev,
							description: value,
						}));
					}}
					required={true}
					maxLength={500}
					minLength={10}
					className="block w-full px-3 py-2 mt-1 border rounded-md placeholder:italic"
					placeholder="Describe your item"
					errorClassName="mt-1 hidden text-sm text-red-600 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block"
					errorMessage="Please enter a description of 10-500 characters"
				/>
			</div>
			<fieldset>
				<legend className="sr-only">Condition</legend>
				<div className="mt-6">
					{/* New & Used Condition */}
					<label
						htmlFor="condition"
						className="block text-sm font-medium text-gray-700"
					>
						Condition
					</label>
					<RadioButton
						id="used"
						name="condition"
						value="false"
						label="Used"
						checked={formState.condition === false}
						onChange={() =>
							setFormState((prev) => ({
								...prev,
								condition: false,
							}))
						}
						labelClassName="ml-2 text-sm text-gray-700"
						containerClassName="flex mt-3"
					/>
					<RadioButton
						id="new"
						name="condition"
						value="true"
						label="New"
						checked={formState.condition === true}
						onChange={() =>
							setFormState((prev) => ({
								...prev,
								condition: true,
							}))
						}
						labelClassName="ml-2 text-sm text-gray-700"
						containerClassName="flex mt-3"
					/>
				</div>
			</fieldset>

			<h1 className="mt-4 text-2xl font-bold">Price &amp; Payment</h1>
			<div className="mt-6">
				{/* Start price */}
				<MoneyTextInput
					label="Start price"
					labelClassName="block text-sm font-medium text-gray-700"
					id="listing-price"
					placeholder="$10.00"
					value={formState.listingPrice}
					onChange={(e) => {
						setFormState((prev) => ({
							...prev,
							listingPrice: e.target.value,
						}));
					}}
				/>
			</div>
			<div className="mt-6">
				{/* Reserve price */}
				<MoneyTextInput
					label="Reserve price (optional)"
					labelClassName="block text-sm font-medium text-gray-700"
					id="listing-reserve"
					placeholder="$20.00"
					value={formState.reservePrice}
					onChange={(e) => {
						setFormState((prev) => ({
							...prev,
							reservePrice: Number(e.target.value),
						}));
					}}
				/>
			</div>
			<fieldset>
				<legend className="sr-only">Payment options</legend>
				<div className="mt-6">
					{/* Payment options */}
					<label
						htmlFor="category"
						className="block text-sm font-medium text-gray-700"
					>
						Payment options
					</label>
					<div className="flex mt-3">
						<Checkbox
							id="payment-credit"
							label="Credit card"
							checked={formState.creditCardPayment}
							onChange={() => {
								setFormState((prev) => ({
									...prev,
									creditCardPayment: !prev.creditCardPayment,
								}));
							}}
						/>
					</div>
					<div className="flex mt-3">
						<Checkbox
							id="payment-bank"
							label="Bank Transfer"
							checked={formState.bankTransferPayment}
							onChange={() => {
								setFormState((prev) => ({
									...prev,
									bankTransferPayment: !prev.bankTransferPayment,
								}));
							}}
						/>
					</div>
					<div className="flex mt-3">
						<Checkbox
							id="payment-bitcoin"
							label="Bitcoin"
							checked={formState.bitcoinPayment}
							onChange={() => {
								setFormState((prev) => ({
									...prev,
									bitcoinPayment: !prev.bitcoinPayment,
								}));
							}}
						/>
					</div>
				</div>
			</fieldset>

			<h1 className="mt-4 text-2xl font-bold">Shipping & pick-up</h1>
			<fieldset>
				<legend className="sr-only">Pick up?</legend>
				{/* Pick up  */}
				<div className="mt-6">
					<label
						htmlFor="pick-up"
						className="block text-sm font-medium text-gray-700"
					>
						Pick up?
					</label>
					<RadioButton
						id="pick-up-true"
						name="pick-up"
						value="true"
						label="Yes"
						checked={formState.pickUp === true}
						onChange={() =>
							setFormState((prev) => ({
								...prev,
								pickUp: true,
							}))
						}
						containerClassName="flex mt-3"
						labelClassName="ml-2 text-sm text-gray-700"
					/>
					<RadioButton
						id="pick-up-false"
						name="pick-up"
						value="false"
						label="No"
						checked={formState.pickUp === false}
						onChange={() =>
							setFormState((prev) => ({
								...prev,
								pickUp: false,
							}))
						}
						containerClassName="flex mt-3"
						labelClassName="ml-2 text-sm text-gray-700"
					/>
				</div>
			</fieldset>

			<fieldset>
				<legend className="sr-only">Shipping options</legend>
				{/* Shipping options */}
				<div className="mt-6">
					<label
						htmlFor="shipping-option"
						className="block text-sm font-medium text-gray-700"
					>
						Shipping options
					</label>
					<RadioButton
						id="shipping-option-courier"
						name="shipping-option"
						value="courier"
						label="Courier"
						checked={formState.shippingOption === "courier"}
						onChange={() =>
							setFormState((prev) => ({
								...prev,
								shippingOption: "courier",
							}))
						}
						containerClassName="flex mt-3"
						labelClassName="ml-2 text-sm text-gray-700"
					/>
					<RadioButton
						id="shipping-option-post"
						name="shipping-option"
						value="post"
						label="Post"
						checked={formState.shippingOption === "post"}
						onChange={() =>
							setFormState((prev) => ({
								...prev,
								shippingOption: "post",
							}))
						}
						containerClassName="flex mt-3"
						labelClassName="ml-2 text-sm text-gray-700"
					/>
				</div>
				<input type="hidden" name="id" value={listingId} />
			</fieldset>

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
