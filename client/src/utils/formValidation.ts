import { isWithinInterval, parseISO, isValid as isDate } from "date-fns";

const MAX_TITLE_LENGTH = 80;
const MIN_TITLE_LENGTH = 3;
const MAX_DESCRIPTION_LENGTH = 500;
const MIN_DESCRIPTION_LENGTH = 10;

// Form validation utility functions

/**
 * Validates if a given date is within the specified range.
 * @param {Date | string} date - The date to check.
 * @param {string} tomorrow - The start of the range (tomorrow) in 'yyyy-MM-dd' format.
 * @param {string} fortnight - The end of the range (two weeks from now) in 'yyyy-MM-dd' format.
 * @returns {boolean} - True if the date is within the range, false otherwise.
 */
function validateDateRange(
	date: Date | string,
	tomorrow: string, // Expected format 'yyyy-MM-dd'
	fortnight: string, // Expected format 'yyyy-MM-dd'
): boolean {
	// Parse dates using parseISO for reliable parsing of 'yyyy-MM-dd'
	const dateToCheck = typeof date === "string" ? parseISO(date) : date;
	const minDate = parseISO(tomorrow);
	const maxDate = parseISO(fortnight);

	// Check if parsed dates are valid before comparing
	if (!isDate(dateToCheck) || !isDate(minDate) || !isDate(maxDate)) {
		console.error("Invalid date provided to validateDateRange");
		return false; // Cannot validate with invalid dates
	}

	// isWithinInterval is inclusive of start and end dates
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
 * Validates if a price is a valid number and positive (greater than zero).
 * @param {number | string} price - The price to validate.
 * @returns {boolean} - True if the price is a valid positive number, false otherwise.
 */
function validatePrice(price: number | string): boolean {
    if (price === null || price === undefined) {
        console.error("Price cannot be null or undefined");
        return false;
    }
    
    const numPrice = typeof price === "string" ? Number.parseFloat(price) : price;
    
    // Check if the parsed number is valid
    if (Number.isNaN(numPrice)) {
        console.error("Invalid price value provided");
        return false;
    }
    
    // Check if the price is finite and positive
    return Number.isFinite(numPrice) && numPrice > 0;
}

export {
	validateDateRange,
	validateTitleLength,
	validateDescriptionLength,
	validatePaymentMethods,
	validatePrice,
};
