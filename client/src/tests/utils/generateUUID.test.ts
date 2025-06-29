import { describe, expect, it, vi } from "vitest";
import { generateUUID } from "~/utils/generateUUID";

describe("generateUUID", () => {
	// Regex pattern for validating UUID v4 format
	const uuidPattern =
		/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

	it("should generate a valid UUID string", () => {
		// Mock the crypto.randomUUID function
		const mockUUID = "123e4567-e89b-42d3-a456-556642440000";
		vi.spyOn(crypto, "randomUUID").mockReturnValue(mockUUID);

		const result = generateUUID();

		expect(result).toBe(mockUUID);
		expect(crypto.randomUUID).toHaveBeenCalled();
	});

	it("should generate unique UUIDs on multiple calls", () => {
		// Mock implementation to return different values on subsequent calls
		const mockUUIDs = [
			["123e4567", "e89b", "42d3", "a456", "556642440001"],
			["123e4567", "e89b", "42d3", "a456", "556642440002"],
		];

		let callCount = 0;
		vi.spyOn(crypto, "randomUUID").mockImplementation(() => {
			const uuidPart1 = mockUUIDs[callCount][0];
			const uuidPart2 = mockUUIDs[callCount][1];
			const uuidPart3 = mockUUIDs[callCount][2];
			const uuidPart4 = mockUUIDs[callCount][3];
			const uuidPart5 = mockUUIDs[callCount][4];
			callCount++;
			return `${uuidPart1}-${uuidPart2}-${uuidPart3}-${uuidPart4}-${uuidPart5}`;
		});

		const uuid1 = generateUUID();
		const uuid2 = generateUUID();

		expect(uuid1).not.toBe(uuid2);
		expect(uuid1).toMatch(uuidPattern);
		expect(uuid2).toMatch(uuidPattern);
	});
});
