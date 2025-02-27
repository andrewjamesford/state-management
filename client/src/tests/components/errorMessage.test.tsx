import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ErrorMessage from "~/components/errorMessage";

describe("ErrorMessage", () => {
	it("renders error message", () => {
		render(<ErrorMessage message="Test error message" />);
		expect(screen.getByText("Test error message")).toBeInTheDocument();
	});

	it("renders with default message when none provided", () => {
		render(<ErrorMessage />);
		expect(screen.getByText("An error occurred")).toBeInTheDocument();
	});

	it("applies error styling classes", () => {
		render(<ErrorMessage message="Test error" />);
		const alert = screen.getByRole("alert");
		expect(alert).toHaveClass("text-red-700");
	});
});
