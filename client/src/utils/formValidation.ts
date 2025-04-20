import {  isWithinInterval } from "date-fns";
// Form validation utility functions
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

function validateTitleLength(title: string): boolean {
	return title.length >= 3 && title.length <= 80;
}

function validateDescriptionLength(description: string): boolean {
	return description.length >= 10 && description.length <= 500;
}

function validatePaymentMethods(
	creditCard: boolean,
	bankTransfer: boolean,
	bitcoin: boolean,
): boolean {
	return creditCard || bankTransfer || bitcoin;
}

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
	return !Number.isNaN(numPrice) && numPrice > 0;
}

export {
    validateDateRange,
    validateTitleLength,
    validateDescriptionLength,
    validatePaymentMethods,
    validatePrice,
};