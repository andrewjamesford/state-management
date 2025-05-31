import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TextInput from "~/components/textInput";

describe("TextInput", () => {
	it("renders with label and input", () => {
		render(
			<TextInput id="test-input" label="Test Label" placeholder="Enter text" />,
		);

		expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
	});

	it("displays error message when provided", () => {
		render(
			<TextInput
				id="test-input"
				label="Test Label"
				errorMessage="This is an error"
				errorClassName="error-class"
			/>,
		);

		expect(screen.getByRole("alert")).toHaveTextContent("This is an error");
	});

	it("handles user input", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<TextInput id="test-input" label="Test Label" onChange={onChange} />,
		);

		const input = screen.getByLabelText("Test Label");
		await user.type(input, "Hello");

		expect(onChange).toHaveBeenCalled();
		expect(input).toHaveValue("Hello");
	});

	it("applies custom classes", () => {
		render(
			<TextInput
				id="test-input"
				label="Test Label"
				labelClassName="custom-label"
				inputClassName="custom-input"
			/>,
		);

		expect(screen.getByText("Test Label")).toHaveClass("custom-label");
	});
});
