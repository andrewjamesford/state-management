import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFoundPage from "~/components/notFoundPage";

describe("NotFoundPage", () => {
	it("renders not found message", () => {
		render(<NotFoundPage />);
		expect(screen.getByText("Page Not Found")).toBeInTheDocument();
	});

	it("uses proper semantic markup", () => {
		render(<NotFoundPage />);
		expect(screen.getByRole("main")).toBeInTheDocument();
		expect(screen.getByRole("heading")).toHaveTextContent("Page Not Found");
	});

	it("applies layout classes", () => {
		render(<NotFoundPage />);
		const main = screen.getByRole("main");
		expect(main).toHaveClass(
			"narrow-layout",
			"main-content",
			"section-padding",
			"page-padding",
		);
	});
});
