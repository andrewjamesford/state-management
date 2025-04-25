import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { addDays, format } from "date-fns";
import { describe, expect, it, vi } from "vitest";
import ListingForm from "~/forms/listingForm";
import type { Category, Listing } from "~/models";

describe("ListingForm validation", () => {
	// Helper function to render the form with necessary props
	const renderForm = (initialFormState: Partial<Listing> = {}) => {
		const today = new Date();
		const tomorrow = new Date(addDays(today, 1));
		const fortnight = new Date(addDays(today, 14));

		const mockCategories: Category[] = [
			{ id: 1, category_name: "Electronics", parent_id: 0, active: true },
			{ id: 2, category_name: "Clothing", parent_id: 0, active: true },
		];

		const mockSubCategories: Category[] = [
			{ id: 3, category_name: "Laptops", parent_id: 1, active: true },
			{ id: 4, category_name: "Phones", parent_id: 1, active: true },
		];

		const defaultFormState: Listing = {
			id: 0,
			title: "",
			subTitle: "",
			categoryId: 0,
			subCategoryId: 0,
			endDate: new Date(tomorrow),
			description: "",
			condition: false,
			listingPrice: 0,
			reservePrice: 0,
			creditCardPayment: false,
			bankTransferPayment: false,
			bitcoinPayment: false,
			pickUp: true,
			shippingOption: "post",
		};

		const setFormState = vi.fn();

		return {
			formState: { ...defaultFormState, ...initialFormState },
			setFormState,
			user: userEvent.setup(),
			...render(
				<ListingForm
					formState={{ ...defaultFormState, ...initialFormState }}
					setFormState={setFormState}
					minDate={tomorrow}
					maxDate={fortnight}
					loadingCategory={false}
					loadingSubCategory={false}
					categoryData={mockCategories}
					subCategoryData={mockSubCategories}
				/>,
			),
		};
	};

	describe("Description validation", () => {
		it("shows error for descriptions less than 10 characters", async () => {
			const { user } = renderForm();

			const descriptionInput = screen.getByLabelText("Description");
			await user.type(descriptionInput, "Too short");
			fireEvent.blur(descriptionInput);

			const error = screen.getByText(
				"Please enter a description of 10-500 characters",
			);
			expect(error).toBeInTheDocument();
		});
	});

	describe("Date validation", () => {
		it("enforces date limits between tomorrow and fortnight", async () => {
			const { user } = renderForm();

			const dateInput = screen.getByLabelText("End date");

			// Test date in the past
			const pastDate = format(addDays(new Date(), -2), "yyyy-MM-dd");
			await user.clear(dateInput);
			await user.type(dateInput, pastDate);
			fireEvent.blur(dateInput);

			expect(
				screen.getByText(
					"Please select a future date between tomorrow and two weeks from now",
				),
			).toBeInTheDocument();

			// Test date too far in the future
			const farFutureDate = format(addDays(new Date(), 30), "yyyy-MM-dd");
			await user.clear(dateInput);
			await user.type(dateInput, farFutureDate);
			fireEvent.blur(dateInput);

			expect(
				screen.getByText(
					"Please select a future date between tomorrow and two weeks from now",
				),
			).toBeInTheDocument();

			// Test valid date
			const validDate = format(addDays(new Date(), 7), "ddMMyyyy");
			await user.clear(dateInput);
			await user.type(dateInput, validDate);
			fireEvent.blur(dateInput);

			// Error should not be visible for valid date
			expect(
				screen.queryByText(
					"Please select a future date between tomorrow and two weeks from now",
				),
			).toHaveClass("hidden");
		});
	});

	describe("Form state updates", () => {
		it("updates title in form state", async () => {
			const { user, setFormState } = renderForm();

			const titleInput = screen.getByLabelText("Listing title");
			await user.type(titleInput, "New Title");

			expect(setFormState).toHaveBeenCalled();
		});

		it("updates category selection", async () => {
			const { user, setFormState } = renderForm();

			const categorySelect = screen.getByLabelText("Category");
			await user.selectOptions(categorySelect, "1");

			expect(setFormState).toHaveBeenCalled();
			// Should be called with a function that updates categoryId to 1 and resets subCategoryId
			const setStateCall = setFormState.mock.calls[0][0];
			const previousState = { categoryId: 0, subCategoryId: 0 };
			const result = setStateCall(previousState);
			expect(result.categoryId).toBe(1);
			expect(result.subCategoryId).toBe(0);
		});

		it("updates payment checkboxes", async () => {
			const { user, setFormState } = renderForm();

			const creditCardCheckbox = screen.getByLabelText("Credit card");
			await user.click(creditCardCheckbox);

			expect(setFormState).toHaveBeenCalled();
			// Should toggle the creditCardPayment boolean
			const setStateCall = setFormState.mock.calls[0][0];
			const previousState = { creditCardPayment: false };
			const result = setStateCall(previousState);
			expect(result.creditCardPayment).toBe(true);
		});

		it("updates shipping options", async () => {
			const { user, setFormState } = renderForm();

			const courierRadio = screen.getByLabelText("Courier");
			await user.click(courierRadio);

			expect(setFormState).toHaveBeenCalled();
			// Should set shippingOption to "courier"
			const setStateCall = setFormState.mock.calls[0][0];
			const previousState = { shippingOption: "post" };
			const result = setStateCall(previousState);
			expect(result.shippingOption).toBe("courier");
		});
	});

	describe("Conditional rendering", () => {
		it("renders loading indicator when categories are loading", () => {
			const today = new Date();
			const tomorrow = new Date(addDays(today, 1));
			const fortnight = new Date(addDays(today, 14));

			render(
				<ListingForm
					formState={{
						id: 0,
						title: "",
						subTitle: "",
						categoryId: 0,
						subCategoryId: 0,
						endDate: new Date(tomorrow),
						description: "",
						condition: false,
						listingPrice: 0,
						reservePrice: 0,
						creditCardPayment: false,
						bankTransferPayment: false,
						bitcoinPayment: false,
						pickUp: true,
						shippingOption: "post",
					}}
					setFormState={vi.fn()}
					minDate={tomorrow}
					maxDate={fortnight}
					loadingCategory={true}
					loadingSubCategory={false}
					categoryData={null}
					subCategoryData={null}
				/>,
			);

			// Should render a loading indicator
			expect(
				screen.getByRole("img", { name: /loading animation/i }),
			).toBeInTheDocument();
		});
	});
});
