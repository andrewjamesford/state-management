import ErrorMessage from "~/components/errorMessage";
import { listingSchema } from "~/models";
import { addDays, format } from "date-fns";
import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import {
	getSessionStorageItem,
	removeSessionStorageItem,
	setSessionStorageItem,
} from "~/utils/sessionStorage";

import api from "~/api";

/**
 * Simple form page
 * @returns { ReactElement }
 */
export default function SimpleFormPage() {
	return (
		<ErrorBoundary
			fallback={
				<ErrorMessage message="An error occurred trying to load the form." />
			}
			onError={(error) => console.error(error)}
		>
			<SimpleFormPageContent />
		</ErrorBoundary>
	);
}

/**
 * Simple form content
 * @returns { ReactElement }
 */
export function SimpleFormPageContent() {
	const today = format(new Date(), "yyyy-MM-dd");
	const tomorrow = format(addDays(today, 1), "yyyy-MM-dd");
	const fortnight = format(addDays(today, 14), "yyyy-MM-dd");
	const storageKey = "simpleForm";

	// Get session storage via hook with key "simpleForm"
	const simpleFormSession = getSessionStorageItem(storageKey);

	const [listingTitle, setListingTitle] = useState(
		simpleFormSession?.listingTitle || "",
	);
	const [endDate, setEndDate] = useState(
		simpleFormSession?.endDate || tomorrow,
	);
	const [startPrice, setStartPrice] = useState(
		simpleFormSession?.startPrice || 0,
	);
	const [description, setDescription] = useState(
		simpleFormSession?.description || "",
	);

	// Handling form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		const listing = listingSchema;
		// Populating listing object with values to be able to add new listing to database
		listing.titleCategory.title = listingTitle;
		listing.titleCategory.subTitle = listingTitle;
		listing.titleCategory.endDate = endDate;
		listing.titleCategory.categoryId = 1;
		listing.titleCategory.subCategoryId = 1;
		listing.pricePayment.listingPrice = startPrice.toString();
		listing.pricePayment.reservePrice = startPrice.toString();
		listing.pricePayment.creditCardPayment = true;
		listing.itemDetails.description = description;

		const response = await api.addListing({ listing: listing });

		if (!response.ok) {
			throw new Error("Error adding listing");
		}
		const result = await response.json();

		if (result.error) {
			throw new Error(result.error);
		}

		removeSessionStorageItem(storageKey);
		alert(`${JSON.stringify(result)} listing added`);
	};

	return (
		<form onSubmit={handleSubmit} noValidate className="group">
			<h1 className="mt-4 text-2xl font-bold">What are you listing?</h1>
			<div className="mt-6">
				<label
					htmlFor="listing-title"
					className="block text-sm font-medium text-gray-700"
				>
					Listing title
				</label>

				<input
					id="listing-title"
					placeholder="e.g. iPhone 5c, Red t-shirt"
					className="block w-full px-3 py-2 mt-1 border rounded-md placeholder:italic invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-600 peer"
					type="text"
					onChange={(e) => {
						const value = e.target.value ?? "";
						setListingTitle(value);
						setSessionStorageItem(storageKey, {
							...simpleFormSession,
							listingTitle: value,
						});
					}}
					value={listingTitle}
					required={true}
					maxLength={80}
					minLength={3}
				/>
				<span className="mt-1 hidden text-sm text-red-600 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
					Please enter a listing title of 3-80 characters
				</span>
				<p className="mt-1 text-sm text-gray-500 ">80 characters max</p>
			</div>

			<div className="mt-6">
				<label
					htmlFor="end-date"
					className="block text-sm font-medium text-gray-700"
				>
					End date
				</label>
				<input
					id="end-date"
					className="block w-full px-3 py-2 mt-1 border rounded-md text-black focus:ring-primary focus:border-primary focus:bg-transparent placeholder:italic peer"
					type="date"
					onChange={(e) => {
						const value = e.target.value ?? "";
						setEndDate(value);
						setSessionStorageItem(storageKey, {
							...simpleFormSession,
							endDate: value,
						});
					}}
					value={endDate}
					required={true}
					pattern="\d{4}-\d{2}-\d{2}"
					datatype="date"
					min={tomorrow}
					max={fortnight}
				/>
				<span className="mt-1 hidden text-sm text-red-600 peer-[&:not(:default):invalid]:block">
					Please select a future date between tomorrow and two weeks from now
				</span>
			</div>
			<div className="mt-6">
				<label
					htmlFor="listing-price"
					className="block text-sm font-medium text-gray-700"
				>
					Start price
				</label>
				<span className="flex">
					<span className="pt-3 pr-2 text-lg">$</span>
					<input
						id="listing-price"
						placeholder="$10.00"
						className="block w-full px-3 py-2 mt-1 border rounded-md placeholder:italic"
						type="number"
						min={1}
						step={1}
						value={startPrice}
						required={true}
						onChange={(e) => {
							const value = e.target.value ?? "";
							const price = Number.parseInt(value, 10);
							setStartPrice(price);
							setSessionStorageItem(storageKey, {
								...simpleFormSession,
								startPrice: price,
							});
						}}
					/>
				</span>
			</div>
			<div className="mt-6">
				<label
					htmlFor="listing-description"
					className="block text-sm font-medium text-gray-700"
				>
					Description
				</label>

				<textarea
					id="listing-description"
					className="block w-full px-3 py-2 mt-1 border rounded-md invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-600 peer"
					value={description}
					onChange={(e) => {
						const value = e.target.value ?? "";
						setDescription(value);
						setSessionStorageItem(storageKey, {
							...simpleFormSession,
							description: value,
						});
					}}
					required={true}
					maxLength={500}
					minLength={10}
					placeholder="Describe your item"
				/>
				<span className="mt-1 hidden text-sm text-red-600 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
					Please enter a description of 10-500 characters
				</span>
			</div>
			<div className="mt-6 grid md:grid-flow-col md:w-1/4 gap-2">
				<button
					type="submit"
					className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 group-invalid:pointer-events-none group-invalid:opacity-30 disabled:cursor-not-allowed"
				>
					Start Listing
				</button>
			</div>
		</form>
	);
}
