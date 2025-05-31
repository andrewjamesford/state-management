import "@testing-library/jest-dom";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Runs a cleanup after each test case
afterEach(() => {
	cleanup();
});
