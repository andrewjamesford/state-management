import {
	createFileRoute,
	useParams,
	useNavigate,
} from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addDays, format, isWithinInterval } from "date-fns";
import { useEffect, useState } from "react";
import type {
	ItemDetails,
	PricePayment,
	Shipping,
	listingData,
	Listing,
	TitleCategory,
} from "~/models";
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
import { list } from "postcss";

export const Route = createFileRoute("/tsquery/$listingId")({
	component: RouteComponent,
});

interface Category {
	id: number;
	category_name: string;
}

function RouteComponent() {
	const today = new Date();
	const tomorrow = format(addDays(today, 1), "yyyy-MM-dd");
	const fortnight = format(addDays(today, 14), "yyyy-MM-dd");

	const navigate = useNavigate({
		from: Route.fullPath,
	});

	const [titleCategory, setTitleCategory] = useState(
		listingSchema.titleCategory as TitleCategory,
	);
	const [itemDetails, setItemDetails] = useState(
		listingSchema.itemDetails as ItemDetails,
	);
	const [pricePayment, setPricePayment] = useState(
		listingSchema.pricePayment as PricePayment,
	);
	const [shipping, setShipping] = useState(listingSchema.shipping as Shipping);

	const { listingId } = useParams({ from: Route.id });
	let prevDate = format(tomorrow, "yyyy-MM-dd");

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
		queryKey: ["subCategories", titleCategory.categoryId],
		queryFn: async () => {
			if (!titleCategory.categoryId) return [];
			const response = await api.getCategories(titleCategory.categoryId);
			if (!response.ok) throw new Error("Error retrieving sub-categories");
			return await response.json();
		},
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (listingData) {
			const isValidDate: boolean = isWithinInterval(
				new Date(listingData.enddate),
				{
					start: tomorrow,
					end: fortnight,
				},
			);
			if (isValidDate) {
				prevDate = format(listingData.enddate, "yyyy-MM-dd");
			}
			setTitleCategory((prev) => ({
				...prev,
				title: listingData.title,
				subTitle: listingData.subtitle,
				endDate: format(prevDate, "yyyy-MM-dd"),
				categoryId: listingData?.categoryid,
				subCategoryId: listingData?.subcategoryid,
			}));
			setItemDetails((prev) => ({
				...prev,
				description: listingData.listingdescription,
				condition: listingData.condition,
			}));
			setPricePayment((prev) => ({
				...prev,
				listingPrice: listingData.listingprice,
				reservePrice: listingData.reserveprice,
				creditCardPayment: listingData.creditcardpayment,
				bankTransferPayment: listingData.banktransferpayment,
				bitcoinPayment: listingData.bitcoinpayment,
			}));
			setShipping((prev) => ({
				...prev,
				pickUp: listingData.pickup,
				shippingOption: listingData.shippingoption,
			}));
		}
	}, [loadingListing]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (pricePayment.reservePrice === "") pricePayment.reservePrice = "0.00";

		const listing: Listing = {
			titleCategory: titleCategory,
			itemDetails: itemDetails,
			pricePayment: pricePayment,
			shipping: shipping,
		};

		const listingWrapper = { listing: listing };

		const response = await api.updateListing(listingId, listingWrapper);
		if (!response.ok) {
			throw new Error("Error updating listing");
		}
		const result = await response.json();
		if (result.error) {
			throw new Error(result.error);
		}
		alert(`${JSON.stringify(result)} listing updated`);

		if (result.error) {
			throw new Error(result.error);
		}

		if (result === 1) {
			return navListings();
		}
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

			<div className="mt-6">
				{/* Subtitle */}
				<TextInput
					labelClassName="block text-sm font-medium text-gray-700"
					label="Subtitle (optional)"
					id="sub-title"
					placeholder="e.g. iPhone 5c, Red t-shirt"
					value={titleCategory.subTitle}
					onChange={(e) => {
						const value = e.target.value ?? "";
						setTitleCategory({
							...titleCategory,
							subTitle: value,
						});
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
						selectClassName={`block w-full h-10 px-3 py-2 items-center justify-between rounded-md border border-input bg-background ring-offset-background peer ${titleCategory.categoryId === 0 ? " italic text-gray-400" : ""}`}
						onChange={(e) => {
							const value = Number.parseInt(e.target.value) || 0;
							setTitleCategory({
								...titleCategory,
								categoryId: value,
								subCategoryId: 0, // reset subcategory
							});
						}}
						value={titleCategory.categoryId}
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
						selectClassName={`block w-full h-10 px-3 py-2 items-center justify-between rounded-md border border-input bg-background ring-offset-background peer ${titleCategory.subCategoryId === 0 ? " italic text-gray-400" : ""}`}
						onChange={(e) => {
							const value = Number.parseInt(e.target.value) || 0;
							setTitleCategory({
								...titleCategory,
								subCategoryId: value,
							});
						}}
						value={titleCategory.subCategoryId}
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
					value={titleCategory.endDate}
					onChange={(e) =>
						setTitleCategory({
							...titleCategory,
							endDate: e.target.value,
						})
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
					value={itemDetails.description}
					onChange={(e) => {
						const value = e.target.value ?? "";
						setItemDetails({ ...itemDetails, description: value });
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
						checked={itemDetails.condition === false}
						onChange={() =>
							setItemDetails({ ...itemDetails, condition: false })
						}
						labelClassName="ml-2 text-sm text-gray-700"
						containerClassName="flex mt-3"
					/>
					<RadioButton
						id="new"
						name="condition"
						value="true"
						label="New"
						checked={itemDetails.condition === true}
						onChange={() => setItemDetails({ ...itemDetails, condition: true })}
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
					value={pricePayment.listingPrice}
					onChange={(e) => {
						setPricePayment({
							...pricePayment,
							listingPrice: e.target.value,
						});
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
					value={pricePayment.reservePrice}
					onChange={(e) => {
						setPricePayment({
							...pricePayment,
							reservePrice: e.target.value,
						});
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
							checked={pricePayment.creditCardPayment}
							onChange={() => {
								setPricePayment({
									...pricePayment,
									creditCardPayment: !pricePayment.creditCardPayment,
								});
							}}
						/>
					</div>
					<div className="flex mt-3">
						<Checkbox
							id="payment-bank"
							label="Bank Transfer"
							checked={pricePayment.bankTransferPayment}
							onChange={() => {
								setPricePayment({
									...pricePayment,
									bankTransferPayment: !pricePayment.bankTransferPayment,
								});
							}}
						/>
					</div>
					<div className="flex mt-3">
						<Checkbox
							id="payment-bitcoin"
							label="Bitcoin"
							checked={pricePayment.bitcoinPayment}
							onChange={() => {
								setPricePayment({
									...pricePayment,
									bitcoinPayment: !pricePayment.bitcoinPayment,
								});
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
						checked={shipping.pickUp === true}
						onChange={() => setShipping({ ...shipping, pickUp: true })}
						containerClassName="flex mt-3"
						labelClassName="ml-2 text-sm text-gray-700"
					/>
					<RadioButton
						id="pick-up-false"
						name="pick-up"
						value="false"
						label="No"
						checked={shipping.pickUp === false}
						onChange={() => setShipping({ ...shipping, pickUp: false })}
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
						checked={shipping.shippingOption === "courier"}
						onChange={() =>
							setShipping({ ...shipping, shippingOption: "courier" })
						}
						containerClassName="flex mt-3"
						labelClassName="ml-2 text-sm text-gray-700"
					/>
					<RadioButton
						id="shipping-option-post"
						name="shipping-option"
						value="post"
						label="Post"
						checked={shipping.shippingOption === "post"}
						onChange={() =>
							setShipping({ ...shipping, shippingOption: "post" })
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
