/**
 * Sets a value in the session storage for the given key
 * @param key - Key to set the value for
 * @param value - Value to set
 * @returns The stored value
 */
function setSessionStorageItem<T>(key: string, value: T): T {
	sessionStorage.setItem(key, JSON.stringify(value));
	return value;
}

/**
 * Gets a value from the session storage for the given key
 * @param key - Key to get the value for
 * @returns Value or undefined if not found in session storage
 */
function getSessionStorageItem<T>(key: string): T | undefined {
	const item = sessionStorage.getItem(key);

	if (item === null) return undefined;

	return JSON.parse(item) as T;
}

/**
 * Removes a value from the session storage for the given key
 * @param key - Key to remove from session storage
 * @returns True if removed from session storage
 */
function removeSessionStorageItem(key: string): boolean {
	sessionStorage.removeItem(key);
	return true;
}

export {
	setSessionStorageItem,
	getSessionStorageItem,
	removeSessionStorageItem,
};
