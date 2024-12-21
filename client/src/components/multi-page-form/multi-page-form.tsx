import api from "~/api";
import ErrorMessage from "~/components/errorMessage";
import { getLocalStorageItem } from "~/utils/localStorage";
import { useState, useEffect, JSX } from "react";
import { ErrorBoundary } from "react-error-boundary";

import BreadCrumbs from "~/components/breadCrumbs";
// titleCategory
import PageOne from "~/components/multi-page-form/page1";
// itemDetails
import PageTwo from "~/components/multi-page-form/page2";
// pricePayment
import PageThree from "~/components/multi-page-form/page3";
// shipping
import PageFour from "~/components/multi-page-form/page4";
// review
import PageFive from "~/components/multi-page-form/page5";

import { listingSchema } from "~/models/listingSchema";

interface TitleCategory {
  userId: string;
  title: string;
  category?: string;
  subTitle?: string;
  categoryId?: string;
  subCategoryId?: string;
  endDate?: string;
}

interface ItemDetails {
  description?: string;
  condition?: string;
  // Add other item details properties as needed
}

interface PricePayment {
  price?: number;
  paymentMethod?: string;
  // Add other price/payment properties as needed
}

interface Shipping {
  method?: string;
  cost?: number;
  // Add other shipping properties as needed
}

interface FormState {
  titleCategory: TitleCategory;
  itemDetails: ItemDetails;
  pricePayment: PricePayment;
  shipping: Shipping;
}

interface MultiPageFormProps {
  step: string;
}

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
export default function MultiPageForm({ step }: MultiPageFormProps): JSX.Element {
	const userID: string = getLocalStorageItem("userId") || "";
	// Add userId to formState
	const [formState, setFormState] = useState<FormState>({
		...listingSchema,
		titleCategory: {
			...listingSchema.titleCategory,
			userId: userID,
			title: listingSchema.titleCategory.title || "",
		},
	});

	const [draftAvailable, setDraftAvailable] = useState<boolean>(false);

	const handleAddListing = async (): Promise<void> => {
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

	const handleLoadDraft = async (userId: string): Promise<void> => {
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
			if (error instanceof Error) {
				console.error("Error loading draft:", error.message);
			} else {
				console.error("Error loading draft:", error);
			}
		}
	};

	const saveDraft = async (): Promise<void> => {
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

	const checkForDraft = async (userId: string): Promise<void> => {
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
			if (error instanceof Error) {
				setError(error);
			} else {
				setError(new Error(String(error)));
			}
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
					<ErrorMessage message="An error occurred trying to load the form." />
				}
				onError={(error) => console.error(error)}
			>
				<BreadCrumbs currentStep={step} />
				{step === "1" && (
					<PageOne
						values={formState.titleCategory}
						setFormState={(newTitleCategory: TitleCategory) => {
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
						setFormState={(newItemDetails: ItemDetails) => {
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
						setFormState={(newPricePayment: PricePayment) => {
							setFormState({
								...formState,
								pricePayment: newPricePayment,
							});
							saveDraft();
						}}
						draftAvailable={draftAvailable}
						handleLoadDraft={handleLoadDraft}
					/>
				)}
				{step === "4" && (
					<PageFour
						values={formState.shipping}
						setFormState={(newShipping: Shipping) => {
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
const [error, setError] = useState<Error | null>(null);

useEffect(() => {
	if (error) {
		console.error("An error occurred:", error.message);
	}
}, [error]);

