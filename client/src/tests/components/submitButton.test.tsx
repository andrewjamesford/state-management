import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import SubmitButton from "~/components/submitButton";

describe("SubmitButton", () => {
	it("renders submit button", () => {
		render(<SubmitButton />);

		const button = screen.getByRole("button");
		expect(button).toHaveTextContent("Save");
		expect(button).toHaveAttribute("type", "submit");
	});

	it("has correct styling classes", () => {
		render(<SubmitButton />);

		const button = screen.getByRole("button");
		// only assert the core utility classes to avoid overly rigid tests
		expect(button).toHaveClass(
			"inline-flex",
			"bg-blue-500",
			"text-white",
		);
	});

	it("can be clicked", async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();

		render(<SubmitButton onClick={onClick} />);

		const button = screen.getByRole("button");
		await user.click(button);

		expect(onClick).toHaveBeenCalled();
	});

	it("maintains accessibility attributes", () => {
		render(<SubmitButton />);

		const button = screen.getByRole("button");
		expect(button).toHaveClass(
			"focus-visible:outline-none",
			"focus-visible:ring-2",
		);
	});
});
