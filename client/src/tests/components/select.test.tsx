import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Select from "~/components/select";

describe("Select", () => {
	const defaultOptions = [
		{ value: "1", label: "Option 1" },
		{ value: "2", label: "Option 2", className: "special-option" },
		{ value: "3", label: "Option 3", disabled: true },
	];

	it("renders with label and options", () => {
		render(
			<Select id="test-select" label="Test Select" options={defaultOptions} />,
		);

		expect(screen.getByLabelText("Test Select")).toBeInTheDocument();
		expect(screen.getAllByRole("option")).toHaveLength(3);
	});

	it("handles selection change", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<Select
				id="test-select"
				label="Test Select"
				options={defaultOptions}
				onChange={onChange}
			/>,
		);

		const select = screen.getByRole("combobox");
		await user.selectOptions(select, "2");

		expect(onChange).toHaveBeenCalled();
		expect(select).toHaveValue("2");
	});

	it("applies disabled state to options", () => {
		render(
			<Select id="test-select" label="Test Select" options={defaultOptions} />,
		);

		const disabledOption = screen.getByRole("option", { name: "Option 3" });
		expect(disabledOption).toBeDisabled();
	});

	it("shows error message when provided", () => {
		render(
			<Select
				id="test-select"
				label="Test Select"
				options={defaultOptions}
				errorMessage="Please select an option"
				errorMessageClassName="error-text"
			/>,
		);

		expect(screen.getByRole("alert")).toHaveTextContent(
			"Please select an option",
		);
		expect(screen.getByRole("alert")).toHaveClass("error-text");
	});

	it("applies custom classes to select and label", () => {
		render(
			<Select
				id="test-select"
				label="Test Select"
				options={defaultOptions}
				selectClassName="custom-select"
				labelClassName="custom-label"
			/>,
		);

		expect(screen.getByRole("combobox")).toHaveClass("custom-select");
		expect(screen.getByText("Test Select")).toHaveClass("custom-label");
	});
});
