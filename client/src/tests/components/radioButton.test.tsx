import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import RadioButton from "~/components/radioButton";

describe("RadioButton", () => {
	it("renders with label", () => {
		render(
			<RadioButton
				id="test-radio"
				name="test-group"
				value="test"
				label="Test Option"
			/>,
		);

		expect(screen.getByLabelText("Test Option")).toBeInTheDocument();
		expect(screen.getByRole("radio")).not.toBeChecked();
	});

	it("can be checked", () => {
		render(
			<RadioButton
				id="test-radio"
				name="test-group"
				value="test"
				label="Test Option"
				checked={true}
			/>,
		);

		expect(screen.getByRole("radio")).toBeChecked();
	});

	it("handles change events", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<RadioButton
				id="test-radio"
				name="test-group"
				value="test"
				label="Test Option"
				onChange={onChange}
			/>,
		);

		const radio = screen.getByRole("radio");
		await user.click(radio);

		expect(onChange).toHaveBeenCalled();
	});

	it("applies custom container and label classes", () => {
		render(
			<RadioButton
				id="test-radio"
				name="test-group"
				value="test"
				label="Test Option"
				containerClassName="custom-container"
				labelClassName="custom-label"
			/>,
		);

		const container = screen.getByRole("radio").closest("div");
		expect(container).toHaveClass("custom-container");
		expect(screen.getByText("Test Option")).toHaveClass("custom-label");
	});

	it("works in a group", () => {
		render(
			<>
				<RadioButton
					id="option1"
					name="test-group"
					value="1"
					label="Option 1"
					checked={true}
				/>
				<RadioButton
					id="option2"
					name="test-group"
					value="2"
					label="Option 2"
					checked={false}
				/>
			</>,
		);

		const option1 = screen.getByLabelText("Option 1");
		const option2 = screen.getByLabelText("Option 2");

		expect(option1).toBeChecked();
		expect(option2).not.toBeChecked();
	});
});
