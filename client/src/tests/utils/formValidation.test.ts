import { describe, it, expect } from 'vitest';
import { addDays, format, isWithinInterval } from 'date-fns';

// Form validation utility functions
function validateDateRange(date: Date | string, tomorrow: string, fortnight: string): boolean {
  // Parse dates if they are strings
  const dateToCheck = typeof date === 'string' ? new Date(date) : date;
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

function validatePaymentMethods(creditCard: boolean, bankTransfer: boolean, bitcoin: boolean): boolean {
  return creditCard || bankTransfer || bitcoin;
}

function validatePrice(price: number | string): boolean {
  const numPrice = typeof price === 'string' ? Number.parseFloat(price) : price;
  return !Number.isNaN(numPrice) && numPrice >= 0;
}

describe('Form Validation Utils', () => {
  describe('validateDateRange', () => {
    const today = new Date();
    const tomorrow = format(addDays(today, 1), 'yyyy-MM-dd');
    const fortnight = format(addDays(today, 14), 'yyyy-MM-dd');
    const threeWeeksFromNow = format(addDays(today, 21), 'yyyy-MM-dd');
    const yesterday = format(addDays(today, -1), 'yyyy-MM-dd');
    
    it('should accept dates within the valid range', () => {
      expect(validateDateRange(tomorrow, tomorrow, fortnight)).toBe(true);
      expect(validateDateRange(format(addDays(today, 7), 'yyyy-MM-dd'), tomorrow, fortnight)).toBe(true);
      expect(validateDateRange(fortnight, tomorrow, fortnight)).toBe(true);
    });
    
    it('should reject dates before tomorrow', () => {
      expect(validateDateRange(yesterday, tomorrow, fortnight)).toBe(false);
      expect(validateDateRange(today, tomorrow, fortnight)).toBe(false);
    });
    
    it('should reject dates after the fortnight', () => {
      expect(validateDateRange(threeWeeksFromNow, tomorrow, fortnight)).toBe(false);
    });
    
    it('should handle Date objects as well as strings', () => {
      expect(validateDateRange(new Date(tomorrow), tomorrow, fortnight)).toBe(true);
      expect(validateDateRange(new Date(yesterday), tomorrow, fortnight)).toBe(false);
    });
  });
  
  describe('validateTitleLength', () => {
    it('should accept titles with valid length', () => {
      expect(validateTitleLength('Abc')).toBe(true);
      expect(validateTitleLength('Valid Title')).toBe(true);
      expect(validateTitleLength('A'.repeat(80))).toBe(true);
    });
    
    it('should reject titles that are too short', () => {
      expect(validateTitleLength('')).toBe(false);
      expect(validateTitleLength('A')).toBe(false);
      expect(validateTitleLength('AB')).toBe(false);
    });
    
    it('should reject titles that are too long', () => {
      expect(validateTitleLength('A'.repeat(81))).toBe(false);
      expect(validateTitleLength('A'.repeat(100))).toBe(false);
    });
  });
  
  describe('validateDescriptionLength', () => {
    it('should accept descriptions with valid length', () => {
      expect(validateDescriptionLength('0123456789')).toBe(true);
      expect(validateDescriptionLength('This is a valid description')).toBe(true);
      expect(validateDescriptionLength('A'.repeat(500))).toBe(true);
    });
    
    it('should reject descriptions that are too short', () => {
      expect(validateDescriptionLength('')).toBe(false);
      expect(validateDescriptionLength('Short')).toBe(false);
      expect(validateDescriptionLength('A'.repeat(9))).toBe(false);
    });
    
    it('should reject descriptions that are too long', () => {
      expect(validateDescriptionLength('A'.repeat(501))).toBe(false);
      expect(validateDescriptionLength('A'.repeat(600))).toBe(false);
    });
  });
  
  describe('validatePaymentMethods', () => {
    it('should accept when at least one payment method is selected', () => {
      expect(validatePaymentMethods(true, false, false)).toBe(true);
      expect(validatePaymentMethods(false, true, false)).toBe(true);
      expect(validatePaymentMethods(false, false, true)).toBe(true);
      expect(validatePaymentMethods(true, true, true)).toBe(true);
    });
    
    it('should reject when no payment method is selected', () => {
      expect(validatePaymentMethods(false, false, false)).toBe(false);
    });
  });
  
  describe('validatePrice', () => {
    it('should accept valid prices', () => {
      expect(validatePrice(0)).toBe(true);
      expect(validatePrice(10)).toBe(true);
      expect(validatePrice(99.99)).toBe(true);
      expect(validatePrice('50')).toBe(true);
      expect(validatePrice('75.50')).toBe(true);
    });
    
    it('should reject negative prices', () => {
      expect(validatePrice(-1)).toBe(false);
      expect(validatePrice('-10')).toBe(false);
    });
    
    it('should reject non-numeric values', () => {
      expect(validatePrice('abc')).toBe(false);
      expect(validatePrice('10abc')).toBe(false);
    });
  });
});