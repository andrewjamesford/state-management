/**
 * Function to set an item in local storage.
 *
 * @param {string} key - The name of the key for the item being saved.
 * @param {T} value - The value that will be saved under the given key.
 * @returns {boolean} True if the save was successful, false otherwise.
 */
function setLocalStorageItem<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Function to get an item from local storage.
 *
 * @param {string} key - The name of the key for the item being retrieved.
 * @returns {T | undefined} The item stored under the given key or undefined if it does not exist.
 */
function getLocalStorageItem<T>(key: string): T | undefined {
  const item = localStorage.getItem(key);

  if (item === null) return undefined;

  try {
    return JSON.parse(item) as T;
  } catch {
    return undefined;
  }
}

/**
 * Function to remove an item from local storage.
 *
 * @param {string} key - The name of the key for the item being removed.
 * @returns {boolean} True if the item was successfully removed.
 */
function removeLocalStorageItem(key: string): boolean {
  localStorage.removeItem(key);
  return true;
}

export { setLocalStorageItem, getLocalStorageItem, removeLocalStorageItem };
