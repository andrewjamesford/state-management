import { lazy, JSX } from "react";

interface FormState {
  titleCategory: Record<string, any>;
  itemDetails: Record<string, any>;
  pricePayment: Record<string, any>;
  shipping: Record<string, any>;
}

interface StepRendererProps {
  step: string;
  formState: FormState;
  setFormState: (state: FormState) => void;
  handleAddListing: () => void;
}

const PageOne = lazy(() => import("@/components/multi-page-form/page1"));
const PageTwo = lazy(() => import("@/components/multi-page-form/page2"));
const PageThree = lazy(() => import("@/components/multi-page-form/page3"));
const PageFour = lazy(() => import("@/components/multi-page-form/page3"));
const PageFive = lazy(() => import("@/components/multi-page-form/page4"));

/**
 * StepRenderer component renders different pages of a multi-step form based on the current step.
 */
export default function StepRenderer({
  step,
  formState,
  setFormState,
  handleAddListing,
}: StepRendererProps): JSX.Element {
  switch (step) {
    case "1":
      return (
        <PageOne
          values={formState.titleCategory}
          setFormState={(newTitleCategory: Record<string, any>) =>
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
          setFormState={(newItemDetails: Record<string, any>) =>
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
          setFormState={(newPricePayment: Record<string, any>) =>
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
          setFormState={(newShipping: Record<string, any>) =>
            setFormState({ ...formState, shipping: newShipping })
          }
        />
      );
    default:
      return <PageFive values={formState} addListing={handleAddListing} />;
  }
}
