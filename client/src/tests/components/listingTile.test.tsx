import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ListingTile from "~/components/listingTile";

// Mock the router Link component
vi.mock("@tanstack/react-router", () => ({
	Link: ({
		children,
		to,
		className,
	}: { children: React.ReactNode; to: string; className?: string }) => (
		<a href={to} className={className}>
			{children}
		</a>
	),
}));

describe("ListingTile", () => {
	const mockListing = {
		id: 1,
		title: "Test Listing",
		subTitle: "Test Subtitle",
		description: "Test Description",
		listingPrice: "100.00",
		reservePrice: "90.00",
		categoryId: 1,
		subCategoryId: 1,
		endDate: "2024-12-31",
		condition: true,
		creditCardPayment: true,
		bankTransferPayment: true,
		bitcoinPayment: false,
		pickUp: true,
		shippingOption: "post",
	};

	it("renders listing details correctly", () => {
		render(<ListingTile listing={mockListing} basePath="/test" />);

		expect(screen.getByText("Test Listing")).toBeInTheDocument();
		expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
		expect(screen.getByText("Test Description")).toBeInTheDocument();
	});

	it("formats price display correctly", () => {
		render(<ListingTile listing={mockListing} basePath="/test" />);

		expect(screen.getByText("US$100.00")).toBeInTheDocument();
	});

	it("shows reserve status correctly when reserve is met", () => {
		render(<ListingTile listing={mockListing} basePath="/test" />);

		expect(screen.getByText("Reserve met")).toBeInTheDocument();
	});

	it('shows "No reserve" when listing price is 0', () => {
		const noReserveListing = {
			...mockListing,
			listingPrice: "0",
			reservePrice: "0",
		};

		render(<ListingTile listing={noReserveListing} basePath="/test" />);

		expect(screen.getByText("No reserve")).toBeInTheDocument();
	});

	it("creates correct link to listing detail", () => {
		render(<ListingTile listing={mockListing} basePath="/test" />);

		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("href", "/test/1");
	});
});
