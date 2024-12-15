/**
 * Function to set an item in local storage.
 *
 * @param {string} key - The name of the key for the item being saved.
 * @param {*} value - The value that will be saved under the given key.
 * @returns {boolean} True if the save was successful, false otherwise.
 */
function setLocalStorageItem(key, value) {
	return localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Function to get an item from local storage.
 *
 * @param {string} key - The name of the key for the item being retrieved.
 * @returns {*} The item stored under the given key or undefined if it does not exist.
 */
function getLocalStorageItem(key) {
	const item = localStorage.getItem(key);

	if (item === null) return undefined;

	return JSON.parse(item);
}

/**
 * Function to remove an item from local storage.
 *
 * @param {string} key - The name of the key for the item being removed.
 * @returns {boolean} True if the item was successfully removed, false otherwise.
 */
function removeLocalStorageItem(key) {
	localStorage.removeItem(key);
	return true;
}

export { setLocalStorageItem, getLocalStorageItem, removeLocalStorageItem };
