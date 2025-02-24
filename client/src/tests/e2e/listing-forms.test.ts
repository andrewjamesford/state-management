import { test, expect } from '@playwright/test';
import { format, addDays } from 'date-fns';

const BASE_URL = 'http://localhost:4002';

const testListing = {
  title: 'Test Listing',
  subTitle: 'Test Subtitle',
  categoryId: 1,
  subCategoryId: 1,
  description: 'Test listing description',
  condition: true,
  listingPrice: '100',
  reservePrice: '50',
  creditCardPayment: true,
  bankTransferPayment: false,
  bitcoinPayment: false,
  pickUp: true,
  shippingOption: 'post'
};

test.describe('Listing Forms', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
  });

  for (const stateManager of ['redux', 'zustand', 'tsquery']) {
    test.describe(`${stateManager} implementation`, () => {
      test('should add a new listing', async ({ page }) => {
        // Navigate to add listing page
        await page.goto(`${BASE_URL}/${stateManager}/add`);
        
        // Fill in the form
        await page.fill('#listing-title', testListing.title);
        await page.fill('#sub-title', testListing.subTitle);
        await page.selectOption('#category', String(testListing.categoryId));
        await page.selectOption('#category-sub', String(testListing.subCategoryId));
        
        // Set end date to tomorrow
        const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
        await page.fill('#end-date', tomorrow);
        
        await page.fill('#listing-description', testListing.description);
        await page.check('#new');
        await page.fill('#listing-price', testListing.listingPrice);
        await page.fill('#listing-reserve', testListing.reservePrice);
        
        // Payment options
        await page.check('#payment-credit');
        await page.uncheck('#payment-bank');
        await page.uncheck('#payment-bitcoin');
        
        // Shipping options
        await page.check('#pick-up-true');
        await page.check('#shipping-option-post');
        
        // Submit and verify
        await page.click('button[type="submit"]');
        
        // Verify redirect to listings page
        await expect(page).toHaveURL(`${BASE_URL}/${stateManager}`);
      });

      test('should edit an existing listing', async ({ page }) => {
        // Navigate to first listing's edit page
        await page.goto(`${BASE_URL}/${stateManager}`);
        const firstListingLink = await page.locator(`a[href^="/${stateManager}/"]`).first();
        await firstListingLink.click();
        
        const updatedTitle = 'Updated Test Listing';
        
        // Update the title
        await page.fill('#listing-title', updatedTitle);
        
        // Update price
        await page.fill('#listing-price', '200');
        
        // Submit and verify
        await page.click('button[type="submit"]');
        
        // Verify redirect to listings page
        await expect(page).toHaveURL(`${BASE_URL}/${stateManager}`);
        
        // Verify the update is reflected
        await expect(page.locator('h2').first()).toContainText(updatedTitle);
      });

      test('should validate required fields', async ({ page }) => {
        await page.goto(`${BASE_URL}/${stateManager}/add`);
        
        // Try to submit empty form
        await page.click('button[type="submit"]');
        
        // Check for validation messages
        await expect(page.locator('text="Please enter a listing title of 3-80 characters"')).toBeVisible();
        await expect(page.locator('text="Please enter a description of 10-500 characters"')).toBeVisible();
        await expect(page.locator('#category')).toHaveAttribute('required', '');
        await expect(page.locator('#end-date')).toHaveAttribute('required', '');
        
        // Fill just the title and verify other validations still show
        await page.fill('#listing-title', 'Test');
        await page.click('button[type="submit"]');
        await expect(page.locator('text="Please enter a description of 10-500 characters"')).toBeVisible();
      });

      test('should handle date validation', async ({ page }) => {
        await page.goto(`${BASE_URL}/${stateManager}/add`);
        
        // Try setting past date
        const yesterday = format(addDays(new Date(), -1), 'yyyy-MM-dd');
        await page.fill('#end-date', yesterday);
        await page.click('button[type="submit"]');
        
        // Verify error for past date
        await expect(page.locator('text="Please select a future date between tomorrow and two weeks from now"')).toBeVisible();
        
        // Try setting date too far in future
        const tooFar = format(addDays(new Date(), 15), 'yyyy-MM-dd');
        await page.fill('#end-date', tooFar);
        await page.click('button[type="submit"]');
        
        // Verify error for date too far in future
        await expect(page.locator('text="Please select a future date between tomorrow and two weeks from now"')).toBeVisible();
        
        // Set valid date
        const validDate = format(addDays(new Date(), 7), 'yyyy-MM-dd');
        await page.fill('#end-date', validDate);
        await page.click('button[type="submit"]');
        
        // Verify date error is gone
        await expect(page.locator('text="Please select a future date between tomorrow and two weeks from now"')).not.toBeVisible();
      });

      test('should handle payment option validation', async ({ page }) => {
        await page.goto(`${BASE_URL}/${stateManager}/add`);
        
        // Fill required fields
        await page.fill('#listing-title', testListing.title);
        await page.fill('#listing-description', testListing.description);
        await page.selectOption('#category', String(testListing.categoryId));
        
        // Uncheck all payment options
        await page.uncheck('#payment-credit');
        await page.uncheck('#payment-bank');
        await page.uncheck('#payment-bitcoin');
        
        // Try to submit
        await page.click('button[type="submit"]');
        
        // Verify error message
        await expect(page.locator('text="At least one of the payment methods must be selected"')).toBeVisible();
        
        // Select one payment option
        await page.check('#payment-credit');
        await page.click('button[type="submit"]');
        
        // Verify payment error is gone
        await expect(page.locator('text="At least one of the payment methods must be selected"')).not.toBeVisible();
      });

      test('should handle shipping options', async ({ page }) => {
        await page.goto(`${BASE_URL}/${stateManager}/add`);
        
        // Check pickup options toggle correctly
        await page.check('#pick-up-true');
        await expect(page.locator('#pick-up-true')).toBeChecked();
        await expect(page.locator('#pick-up-false')).not.toBeChecked();
        
        await page.check('#pick-up-false');
        await expect(page.locator('#pick-up-false')).toBeChecked();
        await expect(page.locator('#pick-up-true')).not.toBeChecked();
        
        // Check shipping options toggle correctly
        await page.check('#shipping-option-courier');
        await expect(page.locator('#shipping-option-courier')).toBeChecked();
        await expect(page.locator('#shipping-option-post')).not.toBeChecked();
        
        await page.check('#shipping-option-post');
        await expect(page.locator('#shipping-option-post')).toBeChecked();
        await expect(page.locator('#shipping-option-courier')).not.toBeChecked();
      });
    });
  }
});