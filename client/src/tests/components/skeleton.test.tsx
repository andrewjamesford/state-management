import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Skeleton from "~/components/skeleton";

describe("Skeleton", () => {
	it("renders single skeleton by default", () => {
		render(<Skeleton />);
		const loadingElements = screen.getAllByText("Loading...");
		expect(loadingElements).toHaveLength(1);
	});

	it("renders card layout skeleton", () => {
		render(<Skeleton layoutType="card" />);
		const skeleton = screen.getByRole("status");
		expect(skeleton).toHaveClass("animate-pulse", "max-w-sm", "rounded-lg");
	});

	it("renders list layout skeleton", () => {
		render(<Skeleton layoutType="list" />);
		const skeleton = screen.getByRole("status");
		expect(skeleton).toHaveClass("animate-pulse");
		expect(skeleton.querySelectorAll(".h-2")).toBeTruthy();
	});

	it("renders multiple skeletons based on repeat prop", () => {
		render(<Skeleton layoutType="card" repeat={3} />);
		const loadingElements = screen.getAllByText("Loading...");
		expect(loadingElements).toHaveLength(3);
	});

	it("includes aria-live for accessibility", () => {
		render(<Skeleton layoutType="list" />);
		const skeleton = screen.getByRole("status");
		expect(skeleton).toHaveAttribute("aria-live", "polite");
	});
});
