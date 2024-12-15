import React, { lazy } from "react";
// titleCategory
const PageOne = lazy(() => import("@/components/multi-page-form/page1"));
// itemDetails
const PageTwo = lazy(() => import("@/components/multi-page-form/page2"));
// pricePayment
const PageThree = lazy(() => import("@/components/multi-page-form/page3"));
// shipping
const PageFour = lazy(() => import("@/components/multi-page-form/page3"));
// review
const PageFive = lazy(() => import("@/components/multi-page-form/page4"));

/**
 * StepRenderer component renders different pages of a multi-step form based on the current step.
 *
 * @param {Object} props - The component props.
 * @param {string} props.step - The current step of the form.
 * @param {Object} props.formState - The current state of the form.
 * @param {Function} props.setFormState - Function to update the form state.
 * @param {Function} props.handleAddListing - Function to handle the form submission.
 * @returns {JSX.Element} The rendered page component for the current step.
 */
export default function StepRenderer({
	step,
	formState,
	setFormState,
	handleAddListing,
}) {
	switch (step) {
		case "1":
			return (
				<PageOne
					values={formState.titleCategory}
					setFormState={(newTitleCategory) =>
						setFormState({
							...formState,
							titleCategory: newTitleCategory,
						})
					}
				/>
			);
		case "2":
			return (
				<PageTwo
					values={formState.itemDetails}
					setFormState={(newItemDetails) =>
						setFormState({
							...formState,
							itemDetails: newItemDetails,
						})
					}
				/>
			);
		case "3":
			return (
				<PageThree
					values={formState.pricePayment}
					setFormState={(newPricePayment) =>
						setFormState({
							...formState,
							pricePayment: newPricePayment,
						})
					}
				/>
			);
		case "4":
			return (
				<PageFour
					values={formState.shipping}
					setFormState={(newShipping) =>
						setFormState({ ...formState, shipping: newShipping })
					}
				/>
			);
		default:
			return <PageFive values={formState} addListing={handleAddListing} />;
	}
}
