import type { ApiError, Category, Listing } from "~/models";

const headers = {
	Accept: "application/json",
	"Content-Type": "application/json",
};

/**
 * Helper function to handle API responses and errors.
 * @param {Response} response - The fetch response.
 * @returns {Promise<T>} The parsed JSON data if successful.
 * @throws {ApiError} If the response is not OK.
 */
async function handleApiResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		let errorDetails: { message?: string };
		try {
			// Attempt to parse error details from the response body
			errorDetails = await response.json();
		} catch (e) {
			// If parsing fails, use the status text
			errorDetails = { message: response.statusText };
		}

		const apiError: ApiError = {
			message:
				errorDetails.message ||
				`API request failed with status ${response.status}`,
			status: response.status,
			details: errorDetails,
		};
		throw apiError;
	}
	// Return the parsed JSON data
	return response.json() as Promise<T>;
}

/**
 * Fetches categories from the API.
 * @param {number} [parentId=0] - The ID of the parent category.
 * @returns {Promise<Category[]>} A promise resolving to an array of categories.
 * @throws {ApiError} If the API request fails.
 */
async function getCategories(parentId = 0): Promise<Category[]> {
	const response = await fetch(
		`${import.meta.env.VITE_API_URL}/categories?parentId=${parentId}`,
		{
			headers,
		},
	);
	return handleApiResponse<Category[]>(response);
}

/**
 * Fetches all listings from the API.
 * @returns {Promise<Listing[]>} A promise resolving to an array of listings.
 * @throws {ApiError} If the API request fails.
 */
async function getListings(): Promise<Listing[]> {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/listings`, {
		headers,
	});
	return handleApiResponse<Listing[]>(response);
}

/**
 * Fetches a specific listing from the API.
 * @param {number} id - The ID of the listing to fetch.
 * @returns {Promise<Listing>} A promise resolving to the listing data.
 * @throws {ApiError} If the API request fails or listing is not found.
 */
async function getListing(id: number): Promise<Listing> {
	const response = await fetch(
		`${import.meta.env.VITE_API_URL}/listings/${id}`,
		{
			headers,
		},
	);
	return handleApiResponse<Listing>(response);
}

/**
 * Fetches a draft listing for a specific user from the API.
 * Using a more specific endpoint path for drafts.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Listing | null>} A promise resolving to the draft listing data or null if not found.
 * @throws {ApiError} If the API request fails (excluding 404).
 */
async function getDraftListing(userId: string): Promise<Listing | null> {
	const response = await fetch(
		`${import.meta.env.VITE_API_URL}/users/${userId}/draft-listing`,
		{
			headers,
		},
	);

	if (response.status === 404) {
		return null; // Return null for not found, not an error
	}

	return handleApiResponse<Listing>(response);
}

/**
 * Adds a new listing to the API.
 * Note: This likely adds a *published* listing. If it's meant to save a draft,
 * the endpoint and method should be reconsidered or aligned with saveDraftListing.
 * Assuming this is for publishing.
 * @param {ListingSchema} listing - The listing data to be added.
 * @returns {Promise<Listing>} A promise resolving to the created listing data.
 * @throws {ApiError} If the API request fails.
 */
async function addListing(listing: Listing): Promise<Listing> {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/listings`, {
		method: "POST",
		headers,
		body: JSON.stringify(listing),
	});
	return handleApiResponse<Listing>(response);
}

/**
 * Updates an existing listing in the API.
 * @param {number} id - The ID of the listing to update.
 * @param {ListingSchema} listing - The updated listing data.
 * @returns {Promise<Listing>} A promise resolving to the updated listing data.
 * @throws {ApiError} If the API request fails.
 */
async function updateListing(id: number, listing: Listing): Promise<Listing> {
	const response = await fetch(
		`${import.meta.env.VITE_API_URL}/listings/${id}`,
		{
			method: "PUT",
			headers,
			body: JSON.stringify(listing),
		},
	);
	return handleApiResponse<Listing>(response);
}

/**
 * Saves a draft listing for a specific user to the API.
 * Using a more specific endpoint path for drafts.
 * @param {string} userId - The ID of the user.
 * @param {ListingSchema} listing - The listing data to be saved as a draft.
 * @returns {Promise<Listing>} A promise resolving to the saved draft listing data.
 * @throws {ApiError} If the API request fails.
 */
async function saveDraftListing(
	userId: string,
	listing: Listing,
): Promise<Listing> {
	const response = await fetch(
		`${import.meta.env.VITE_API_URL}/users/${userId}/draft-listing`,
		{
			method: "POST",
			headers,
			body: JSON.stringify(listing),
		},
	);
	return handleApiResponse<Listing>(response);
}

export default {
	getCategories,
	getListings,
	addListing,
	updateListing,
	saveDraftListing,
	getDraftListing,
	getListing,
};
