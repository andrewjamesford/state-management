import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BreadCrumbs from "~/components/breadCrumbs";
import { useLocation } from "@tanstack/react-router";

// Mock the router hook
vi.mock("@tanstack/react-router", () => ({
  useLocation: vi.fn(),
}));

describe("BreadCrumbs", () => {
  beforeEach(() => {
    // Setup default mock implementation
    vi.mocked(useLocation).mockReturnValue({
      pathname: "/redux/2",
    } as any);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders all breadcrumb steps", () => {
    render(<BreadCrumbs currentStep={2} />);

    expect(screen.getByText("Title & Category")).toBeInTheDocument();
    expect(screen.getByText("Item Details")).toBeInTheDocument();
    expect(screen.getByText("Price & Payment")).toBeInTheDocument();
    expect(screen.getByText("Shipping & Pick-up")).toBeInTheDocument();
    expect(screen.getByText("Review & Submit")).toBeInTheDocument();
    
    // Check for navigation arrows
    const arrows = screen.getAllByText(">", { exact: false });
    expect(arrows).toHaveLength(5); // One arrow for each step
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

  it("generates correct href attributes based on path", () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: "/context/2",
    } as any);
    
    render(<BreadCrumbs currentStep={2} />);

    // Check that hrefs include the correct page from the URL
    const activeLink = screen.getByText("Item Details").closest("a");
    expect(activeLink).toHaveAttribute("href", "/context/2");
  });
});
