import type { Listing } from "~/models";

const headers = {
	Accept: "application/json",
	"Content-Type": "application/json",
};

/**
 * Fetches categories from the API.
 * @param {number} [parentId=0] - The ID of the parent category.
 * @returns {Promise<Response>} The fetch response promise.
 */
async function getCategories(parentId = 0) {
	return await fetch(
		`${import.meta.env.VITE_API_URL}/categories?parentId=${parentId}`,
		{
			headers,
		},
	);
}

/**
 * Fetches all listings from the API.
 * @returns {Promise<Response>} The fetch response promise.
 */
async function getListings() {
	return await fetch(`${import.meta.env.VITE_API_URL}/listings`, {
		headers,
	});
}

/**
 * Fetches a specific listing from the API.
 * @param {string} id - The ID of the listing to fetch.
 * @returns {Promise<Response>} The fetch response promise.
 */
async function getListing(id: string): Promise<Response> {
	return await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
		headers,
	});
}

/**
 * Fetches a draft listing for a specific user from the API.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Response>} The fetch response promise.
 */
async function getDraftListing(userId: string): Promise<Response> {
	return await fetch(`${import.meta.env.VITE_API_URL}/listings/${userId}`, {
		headers,
	});
}

/**
 * Adds a new listing to the API.
 * @param {Listing} listing - The listing data to be added.
 * @returns {Promise<Response>} The fetch response promise.
 */
async function addListing(listing: Listing): Promise<Response> {
	return await fetch(`${import.meta.env.VITE_API_URL}/listings`, {
		method: "POST",
		headers,
		body: JSON.stringify(listing),
	});
}

/**
 * Updates an existing listing in the API.
 * @param {string} id - The ID of the listing to update.
 * @param {Listing} listing - The updated listing data.
 * @returns {Promise<Response>} The fetch response promise.
 */
async function updateListing(id: string, listing: Listing): Promise<Response> {
	return await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
		method: "PUT",
		headers,
		body: JSON.stringify(listing),
	});
}

/**
 * Saves a draft listing for a specific user to the API.
 * @param {string} userId - The ID of the user.
 * @param {Listing} listing - The listing data to be saved as a draft.
 * @returns {Promise<Response>} The fetch response promise.
 */
async function saveDraftListing(
	userId: string,
	listing: Listing,
): Promise<Response> {
	return await fetch(`${import.meta.env.VITE_API_URL}/listings/${userId}`, {
		method: "POST",
		headers,
		body: JSON.stringify(listing),
	});
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
