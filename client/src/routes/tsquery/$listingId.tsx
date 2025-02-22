import {
	createFileRoute,
	useParams,
	useNavigate,
} from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { addDays, format, isWithinInterval } from "date-fns";
import { useEffect, useState } from "react";
import type { Listing } from "~/models";
import { listingSchema } from "~/models";
import Loader from "~/components/loader";
import api from "~/api";
import RadioButton from "~/components/radioButton";
import DateInput from "~/components/dateInput";
import TextInput from "~/components/textInput";
import Select from "~/components/select";
import Textarea from "~/components/textarea";
import MoneyTextInput from "~/components/moneyTextInput";
import Checkbox from "~/components/Checkbox";
import SubmitButton from "~/components/submitButton";

export const Route = createFileRoute("/tsquery/$listingId")({
	component: RouteComponent,
});

interface Category {
	id: number;
	category_name: string;
}

/**
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
 * @component
 * @example
 * ```tsx
 * <RouteComponent />
 * ```
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
 */

function RouteComponent() {
	const today = new Date();
	const tomorrow = format(addDays(today, 1), "yyyy-MM-dd");
	const fortnight = format(addDays(today, 14), "yyyy-MM-dd");

	const navigate = useNavigate({
		from: Route.fullPath,
	});

	const [formState, setFormState] = useState(listingSchema);

	const { listingId } = useParams({ from: Route.id });
	const prevDate = format(tomorrow, "yyyy-MM-dd");

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
		data: parentCatData,
		isLoading: loadingCategory,
		error: parentError,
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
		data: subCatData,
		isLoading: loadingSubCategory,
		error: subCatError,
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

	if (parentError) return <p>Error: {parentError.message}</p>;
	if (subCatError) return <p>Error: {subCatError.message}</p>;
	if (listingError) return <p>Error: {listingError.message}</p>;
	if (loadingListing) return <Loader height={50} width={50} />;

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
							setFormState((prev) => ({
								...prev,
								titleCategory: { ...prev, subCategoryId: value },
							}));
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
							listingPrice: Number(e.target.value),
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
