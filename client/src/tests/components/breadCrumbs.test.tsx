import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BreadCrumbs from "~/components/breadCrumbs";

// Create a mock module for @tanstack/react-router
const useLocationMock = vi.fn();

// Mock the TanStack Router hooks
vi.mock("@tanstack/react-router", () => {
	return {
		useLocation: useLocationMock,
		Link: ({ 
			children, 
			to, 
			className 
		}: { 
			children: React.ReactNode; 
			to: string; 
			className?: string 
		}) => (
			<a href={to} className={className}>
				{children}
			</a>
		),
	};
});

describe("BreadCrumbs", () => {
	beforeEach(() => {
		// Reset the mock before each test
		useLocationMock.mockReturnValue({
			pathname: "/redux/2"
		});
	});

	it("renders all breadcrumb steps", () => {
		render(<BreadCrumbs currentStep={2} />);
		
		expect(screen.getByText("Title & Category")).toBeInTheDocument();
		expect(screen.getByText("Item Details")).toBeInTheDocument();
		expect(screen.getByText("Price & Payment")).toBeInTheDocument();
		expect(screen.getByText("Shipping & Pick-up")).toBeInTheDocument();
		expect(screen.getByText("Review & Submit")).toBeInTheDocument();
	});

	it("applies active styling to the current step", () => {
		render(<BreadCrumbs currentStep={2} />);
		
		// Check if the second step has the active styling (is a link)
		const activeStep = screen.getByText("Item Details").closest("a");
		expect(activeStep).toHaveClass("font-semibold");
		expect(activeStep).toHaveClass("underline");
	});

	it("applies inactive styling to other steps", () => {
		render(<BreadCrumbs currentStep={2} />);
		
		// Check if the first step has the inactive styling (is a span)
		const inactiveStep = screen.getByText("Title & Category").closest("span");
		expect(inactiveStep).toHaveClass("text-slate-400");
	});

	it("handles different paths correctly", () => {
		// Change the mock to return a different path
		useLocationMock.mockReturnValue({ 
			pathname: "/tsquery/3" 
		});
		
		render(<BreadCrumbs currentStep={3} />);
		
		// Third step should now be active
		const activeStep = screen.getByText("Price & Payment").closest("a");
		expect(activeStep).toHaveClass("font-semibold");
		expect(activeStep).toHaveClass("underline");
	});
});