/**
 * Generates a cryptographically secure random UUID (Universally Unique IDentifier).
 * Uses the Web Crypto API's randomUUID() method.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID | MDN Crypto.randomUUID()}
 * @returns {string} A randomly generated UUID in the format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 */
export function generateUUID() {
	return crypto.randomUUID();
}
