/**
 * Sets a value in the session storage for the given key
 * @param {string} key - Key to set the value for
 * @param {string} value - Value to set
 * @returns value
 */
function setSessionStorageItem(key, value) {
	return sessionStorage.setItem(key, JSON.stringify(value));
}

/**
 * Gets a value from the session storage for the given key
 * @param {string} key - Key to get the value for
 * @returns value or undefined if not found in session storage.
 */
function getSessionStorageItem(key) {
	const item = sessionStorage.getItem(key);

	if (item === null) return undefined;

	return JSON.parse(item);
}

/**
 * Removes a value from the session storage for the given key
 * @param {string} key - Key to remove from session storage
 * @returns boolean - True if removed from session storage
 */
function removeSessionStorageItem(key) {
	sessionStorage.removeItem(key);
	return true;
}

export {
	setSessionStorageItem,
	getSessionStorageItem,
	removeSessionStorageItem,
};
