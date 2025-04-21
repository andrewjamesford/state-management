import { isWithinInterval } from "date-fns";

const MAX_TITLE_LENGTH = 80;
const MIN_TITLE_LENGTH = 3;
const MAX_DESCRIPTION_LENGTH = 500;
const MIN_DESCRIPTION_LENGTH = 10;

// Form validation utility functions

/**
 * Validates if a given date is within the specified range.
 * @param {Date | string} date - The date to check.
 * @param {string} tomorrow - The start of the range (tomorrow).
 * @param {string} fortnight - The end of the range (two weeks from now).
 * @returns {boolean} - True if the date is within the range, false otherwise.
 */
function validateDateRange(
	date: Date | string,
	tomorrow: string,
	fortnight: string,
): boolean {
	// Parse dates if they are strings
	const dateToCheck = typeof date === "string" ? new Date(date) : date;
	const minDate = new Date(tomorrow);
	const maxDate = new Date(fortnight);

	return isWithinInterval(dateToCheck, { start: minDate, end: maxDate });
}

/**
 * Validates the length of a title.
 * @param {string} title - The title to validate.
 * @returns {boolean} - True if the title length is valid, false otherwise.
 */
function validateTitleLength(title: string): boolean {
	return title.length >= MIN_TITLE_LENGTH && title.length <= MAX_TITLE_LENGTH;
}

/**
 * Validates the length of a description.
 * @param {string} description - The description to validate.
 * @returns {boolean} - True if the description length is valid, false otherwise.
 */
function validateDescriptionLength(description: string): boolean {
	return (
		description.length >= MIN_DESCRIPTION_LENGTH &&
		description.length <= MAX_DESCRIPTION_LENGTH
	);
}

/**
 * Validates if at least one payment method is selected.
 * @param {boolean} creditCard - Whether credit card payment is selected.
 * @param {boolean} bankTransfer - Whether bank transfer payment is selected.
 * @param {boolean} bitcoin - Whether bitcoin payment is selected.
 * @returns {boolean} - True if at least one payment method is selected, false otherwise.
 */
function validatePaymentMethods(
	creditCard: boolean,
	bankTransfer: boolean,
	bitcoin: boolean,
): boolean {
	return creditCard || bankTransfer || bitcoin;
}

/**
 * Validates if a price is a valid number and not zero or negative.
 * @param {number | string} price - The price to validate.
 * @returns {boolean} - True if the price is valid, false otherwise.
 */
function validatePrice(price: number | string): boolean {
	const numPrice = typeof price === "string" ? Number.parseFloat(price) : price;
	// Check if the price is a valid number and not NaN
	if (Number.isNaN(numPrice)) {
		return false;
	}
	if (numPrice === 0) {
		return false;
	}
	if (numPrice < 0) {
		return false;
	}
	return true;
}

export {
	validateDateRange,
	validateTitleLength,
	validateDescriptionLength,
	validatePaymentMethods,
	validatePrice,
};
