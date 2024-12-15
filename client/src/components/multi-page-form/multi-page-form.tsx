import api from "@/api";
import ErrorMessage from "@/components/errorMessage";
import { getLocalStorageItem } from "@/utils/localStorage";
import React, { useState, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";

import BreadCrumbs from "@/components/breadCrumbs";
// titleCategory
import PageOne from "@/components/multi-page-form/page1";
// itemDetails
import PageTwo from "@/components/multi-page-form/page2";
// pricePayment
import PageThree from "@/components/multi-page-form/page3";
// shipping
import PageFour from "@/components/multi-page-form/page4";
// review
import PageFive from "@/components/multi-page-form/page5";

import { listingSchema } from "@/models/listingSchema";

/**
 * MultiPageForm component handles the multi-step form for adding a listing.
 * It manages the form state, draft saving/loading, and form submission.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.step - The current step of the form.
 *
 * @returns {JSX.Element} The rendered MultiPageForm component.
 *
 * @example
 * <MultiPageForm step="1" />
 */
export default function MultiPageForm({ step }) {
	const userID = getLocalStorageItem("userId");
	// Add userId to formState
	const [formState, setFormState] = useState({
		...listingSchema,
		titleCategory: {
			...listingSchema.titleCategory,
			userId: userID,
		},
	});

	const [draftAvailable, setDraftAvailable] = useState(false);

	const handleAddListing = async () => {
		const listing = {
			listing: formState,
		};
		const response = await api.addListing(listing);

		if (!response.ok) {
			throw new Error("Error adding listing");
		}
		const result = await response.json();

		if (result.error) {
			throw new Error(result.error);
		}

		alert(`${JSON.stringify(result)} listing added`);
	};

	const handleLoadDraft = async (userId) => {
		try {
			const response = await api.getDraftListing(userId);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const result = await response.json();
			if (!result || result.length === 0) {
				throw new Error("No draft record found");
			}
			const draftValues = result[0]?.draft || {};
			setFormState((prevState) => {
				const newState = {
					...prevState,
					titleCategory: draftValues.titleCategory || prevState.titleCategory,
					itemDetails: draftValues.itemDetails || prevState.itemDetails,
					pricePayment: draftValues.pricePayment || prevState.pricePayment,
					shipping: draftValues.shipping || prevState.shipping,
				};
				console.log("New form state:", newState);
				return newState;
			});
			console.log("Draft loaded successfully:", draftValues);
		} catch (error) {
			console.error("Error loading draft:", error.message);
		}
	};

	const saveDraft = async () => {
		const listing = {
			listing: formState,
		};
		if (!formState) {
			throw new Error("No form state to save");
		}
		const response = await api.saveDraftListing(userID, listing);
		if (!response.ok) {
			throw new Error("Error saving draft");
		}
		const result = await response.json();
		if (result.error) {
			throw new Error(result.error);
		}
		console.log("Draft saved successfully");
	};

	const checkForDraft = async (userId) => {
		// Check if there is already a draft record for this users id
		try {
			if (userId.length === 0) {
				return;
			}
			// Call the api to check for a draft record
			const response = await api.getDraftListing(userId);
			if (response.status === 200) {
				const result = await response.json();
				if (result.length > 0) {
					setDraftAvailable(true);
				}
			}
		} catch (error) {
			setDraftAvailable(false);
			setError(error);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		checkForDraft(userID);
	}, [userID]);

	console.log("Listing form state:", formState, step, draftAvailable);
	return (
		<>
			<ErrorBoundary
				fallback={
					<ErrorMessage message="An error occured trying to load the form." />
				}
				onError={(error) => console.error(error)}
			>
				<BreadCrumbs currentStep={step} />
				{step === "1" && (
					<PageOne
						values={formState.titleCategory}
						setFormState={(newTitleCategory) => {
							setFormState({
								...formState,
								titleCategory: newTitleCategory,
							});
							saveDraft();
						}}
						draftAvailable={draftAvailable}
						handleLoadDraft={handleLoadDraft}
					/>
				)}
				{step === "2" && (
					<PageTwo
						values={formState.itemDetails}
						setFormState={(newItemDetails) => {
							setFormState({
								...formState,
								itemDetails: newItemDetails,
							});
							saveDraft();
						}}
						draftAvailable={draftAvailable}
						handleLoadDraft={handleLoadDraft}
					/>
				)}
				{step === "3" && (
					<PageThree
						values={formState.pricePayment}
						setFormState={(newPricePayment) => {
							setFormState({
								...formState,
								pricePayment: newPricePayment,
							});
							saveDraft();
						}}
					/>
				)}
				{step === "4" && (
					<PageFour
						values={formState.shipping}
						setFormState={(newShipping) => {
							setFormState({ ...formState, shipping: newShipping });
							saveDraft();
						}}
						draftAvailable={draftAvailable}
						handleLoadDraft={handleLoadDraft}
					/>
				)}
				{step === "5" && (
					<PageFive values={formState} addListing={handleAddListing} />
				)}
			</ErrorBoundary>
		</>
	);
}
