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
import RadioButton from "~/components/radioButton";
import DateInput from "~/components/dateInput";
import TextInput from "~/components/textInput";
import Select from "~/components/select";
import Textarea from "~/components/textarea";
import MoneyTextInput from "~/components/moneyTextInput";
import Checkbox from "~/components/Checkbox";
import ErrorMessage from "~/components/errorMessage";

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
		data: parentCatData,
		isLoading: loadingCategory,
		isError: parentError,
	} = useGetParentCategoriesQuery();
	const {
		data: subCatData,
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
					id="category-sub"
					placeholder="e.g. iPhone 5c, Red t-shirt"
					value={formState.title}
					onChange={(e) => {
						const value = e.target.value ?? "";
						setFormState((prev) => ({
							...prev,
							title: value,
						}));
					}}
					required={false}
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
								subCategoryId: 0, // reset subcategory
							}));
						}}
						value={formState.categoryId}
						required={true}
					>
						<option value={0} className="text-muted-foreground italic">
							Select a category...
						</option>
						{parentCatData?.map((category: Category) => (
							<option key={category.id} value={category.id}>
								{category.category_name}
							</option>
						))}
					</Select>
				)}
			</div>

			<div className="mt-6">
				{/* Sub Category */}
				{loadingSubCategory && <Loader width={20} height={20} />}
				<Select
					label="Sub Category"
					labelClassName="block text-sm font-medium text-gray-700"
					id="category-sub"
					selectClassName={`block w-full h-10 px-3 py-2 items-center justify-between rounded-md border border-input bg-background ring-offset-background peer ${formState.subCategoryId === 0 ? " italic text-gray-400" : ""}`}
					onChange={(e) => {
						const value = Number.parseInt(e.target.value) || 0;
						setFormState((prev) => ({
							...prev,
							subCategoryId: value,
						}));
					}}
					value={formState.subCategoryId}
					required={true}
					disabled={!subCatData}
				>
					<option value={0} className="text-muted-foreground italic">
						Select a sub category...
					</option>
					{subCatData?.map((category: Category) => (
						<option key={category.id} value={category.id}>
							{category.category_name}
						</option>
					))}
				</Select>
			</div>

			<div className="mt-6">
				{/* End date */}
				<DateInput
					label="End date"
					labelClassName="block text-sm font-medium text-gray-700"
					id="end-date"
					value={formState.endDate}
					onChange={(e) => {
						const value = e.target.value ?? tomorrow;
						setFormState((prev) => ({
							...prev,
							endDate: value,
						}));
					}}
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
				<MoneyTextInput
					label="Start price"
					labelClassName="block text-sm font-medium text-gray-700"
					id="listing-price"
					placeholder="$10.00"
					value={formState.listingPrice}
					onChange={(e) => {
						checkValue(Number(e.target.value));
						setFormState((prev) => ({
							...prev,
							listingPrice: Number(e.target.value),
						}));
					}}
					required={true}
					errorMessage="Price must be less than $10"
					errorClassName="mt-1 hidden text-sm text-red-600 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block"
				/>
			</div>
			<div className="mt-6">
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
							onChange={() =>
								setFormState((prev) => ({
									...prev,
									creditCardPayment: !prev.creditCardPayment,
								}))
							}
						/>
					</div>
					<div className="flex mt-3">
						<Checkbox
							id="payment-bank"
							label="Bank Transfer"
							checked={formState.bankTransferPayment}
							onChange={() =>
								setFormState((prev) => ({
									...prev,
									bankTransferPayment: !prev.bankTransferPayment,
								}))
							}
						/>
					</div>
					<div className="flex mt-3">
						<Checkbox
							id="payment-bitcoin"
							label="Bitcoin"
							checked={formState.bitcoinPayment}
							onChange={() =>
								setFormState((prev) => ({
									...prev,
									bitcoinPayment: !prev.bitcoinPayment,
								}))
							}
						/>
					</div>
				</div>
			</fieldset>

			<h1 className="mt-4 text-2xl font-bold">Shipping & pick-up</h1>
			<fieldset>
				<legend className="sr-only">Pick up?</legend>
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
