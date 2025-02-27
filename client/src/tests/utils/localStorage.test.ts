import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	getLocalStorageItem,
	removeLocalStorageItem,
	setLocalStorageItem,
} from "~/utils/localStorage";

describe("localStorage utilities", () => {
	// Mock localStorage before each test
	beforeEach(() => {
		// Create a mock of localStorage
		const localStorageMock = {
			getItem: vi.fn(),
			setItem: vi.fn(),
			removeItem: vi.fn(),
			clear: vi.fn(),
			length: 0,
			key: vi.fn(),
		};

		// Replace the global localStorage with our mock
		Object.defineProperty(window, "localStorage", {
			value: localStorageMock,
			writable: true,
		});
	});

	describe("setLocalStorageItem", () => {
		it("should store a value in localStorage", () => {
			const result = setLocalStorageItem("testKey", "testValue");
			expect(localStorage.setItem).toHaveBeenCalledWith(
				"testKey",
				'"testValue"',
			);
			expect(result).toBe(true);
		});

		it("should handle objects", () => {
			const testObj = { name: "test", value: 42 };
			const result = setLocalStorageItem("objectKey", testObj);
			expect(localStorage.setItem).toHaveBeenCalledWith(
				"objectKey",
				JSON.stringify(testObj),
			);
			expect(result).toBe(true);
		});

		it("should return false when localStorage throws", () => {
			vi.spyOn(localStorage, "setItem").mockImplementation(() => {
				throw new Error("Storage quota exceeded");
			});
			const result = setLocalStorageItem("failKey", "value");
			expect(result).toBe(false);
		});
	});

	describe("getLocalStorageItem", () => {
		it("should retrieve a stored value", () => {
			vi.spyOn(localStorage, "getItem").mockReturnValue('"storedValue"');
			const result = getLocalStorageItem("testKey");
			expect(localStorage.getItem).toHaveBeenCalledWith("testKey");
			expect(result).toBe("storedValue");
		});

		it("should handle objects", () => {
			const testObj = { name: "test", value: 42 };
			vi.spyOn(localStorage, "getItem").mockReturnValue(
				JSON.stringify(testObj),
			);
			const result = getLocalStorageItem("objectKey");
			expect(localStorage.getItem).toHaveBeenCalledWith("objectKey");
			expect(result).toEqual(testObj);
		});

		it("should return undefined when key does not exist", () => {
			vi.spyOn(localStorage, "getItem").mockReturnValue(null);
			const result = getLocalStorageItem("nonExistentKey");
			expect(result).toBeUndefined();
		});

		it("should return undefined when JSON parsing fails", () => {
			vi.spyOn(localStorage, "getItem").mockReturnValue("invalid JSON");
			const result = getLocalStorageItem("invalidKey");
			expect(result).toBeUndefined();
		});
	});

	describe("removeLocalStorageItem", () => {
		it("should remove an item from localStorage", () => {
			const result = removeLocalStorageItem("testKey");
			expect(localStorage.removeItem).toHaveBeenCalledWith("testKey");
			expect(result).toBe(true);
		});
	});
});
