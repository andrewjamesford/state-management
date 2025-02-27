import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import DateInput from "~/components/dateInput";

describe("DateInput", () => {
	it("renders with label", () => {
		render(<DateInput id="test-date" label="Test Date" />);

		expect(screen.getByLabelText("Test Date")).toBeInTheDocument();
		const input = screen.getByLabelText("Test Date");
		expect(input).toHaveAttribute("type", "date");
	});

	it("handles date input", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const testDate = "2024-03-20";

		render(<DateInput id="test-date" label="Test Date" onChange={onChange} />);

		const input = screen.getByLabelText("Test Date");
		await user.type(input, testDate);

		expect(onChange).toHaveBeenCalled();
		expect(input).toHaveValue(testDate);
	});

	it("shows error message when provided", () => {
		render(
			<DateInput
				id="test-date"
				label="Test Date"
				error="Invalid date"
				errorClassName="error-message"
			/>,
		);

		expect(screen.getByText("Invalid date")).toHaveClass("error-message");
	});

	it("applies min and max date constraints", () => {
		render(
			<DateInput
				id="test-date"
				label="Test Date"
				min="2024-03-01"
				max="2024-03-31"
			/>,
		);

		const input = screen.getByLabelText("Test Date");
		expect(input).toHaveAttribute("min", "2024-03-01");
		expect(input).toHaveAttribute("max", "2024-03-31");
	});

	it("applies custom classes", () => {
		const defaultClass =
			"block w-full px-3 py-2 mt-1 border rounded-md text-black focus:ring-primary focus:border-primary focus:bg-transparent placeholder:italic peer";

		render(
			<DateInput
				id="test-date"
				label="Test Date"
				labelClassName="custom-label"
			/>,
		);

		const input = screen.getByLabelText("Test Date");
		expect(input).toHaveClass(defaultClass);
		expect(screen.getByText("Test Date")).toHaveClass("custom-label");
	});
});
