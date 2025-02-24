import { test, expect } from '@playwright/test';
import { format, addDays } from 'date-fns';
import type { ListingSchema, Category } from '~/models';

test.describe('ListingForm Component', () => {
  const mockCategories: Category[] = [
    { id: 1, category_name: 'Electronics', parent_id: 0, active: true },
    { id: 2, category_name: 'Clothing', parent_id: 0, active: true }
  ];

  const mockSubCategories: Category[] = [
    { id: 3, category_name: 'Phones', parent_id: 1, active: true },
    { id: 4, category_name: 'Laptops', parent_id: 1, active: true }
  ];

  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const fortnight = format(addDays(new Date(), 14), 'yyyy-MM-dd');

  test('should properly handle category selection', async ({ page }) => {
    // Navigate to add listing page (using any state manager)
    await page.goto('/redux/add');

    // Select a category
    await page.selectOption('#category', '1');

    // Verify subcategories are loaded
    const subCategorySelect = page.locator('#category-sub');
    await expect(subCategorySelect).toBeEnabled();
    
    // Verify subcategory options
    const options = await subCategorySelect.locator('option').all();
    expect(options.length).toBeGreaterThan(1);
  });

  test('should handle date validation', async ({ page }) => {
    await page.goto('/redux/add');

    // Try to set past date
    const yesterday = format(addDays(new Date(), -1), 'yyyy-MM-dd');
    await page.fill('#end-date', yesterday);
    
    // Verify validation message
    await expect(page.locator('text="Please select a future date between tomorrow and two weeks from now"')).toBeVisible();

    // Set valid date
    await page.fill('#end-date', tomorrow);
    await expect(page.locator('text="Please select a future date between tomorrow and two weeks from now"')).not.toBeVisible();
  });

  test('should handle price inputs', async ({ page }) => {
    await page.goto('/redux/add');

    // Test listing price validation
    await page.fill('#listing-price', 'invalid');
    await expect(page.locator('#listing-price')).toHaveValue('0');

    await page.fill('#listing-price', '100.50');
    await expect(page.locator('#listing-price')).toHaveValue('100.50');

    // Test reserve price validation
    await page.fill('#listing-reserve', 'invalid');
    await expect(page.locator('#listing-reserve')).toHaveValue('0');

    await page.fill('#listing-reserve', '50.25');
    await expect(page.locator('#listing-reserve')).toHaveValue('50.25');
  });

  test('should handle shipping and pickup options', async ({ page }) => {
    await page.goto('/redux/add');

    // Test pickup options
    await page.check('#pick-up-true');
    await expect(page.locator('#pick-up-true')).toBeChecked();
    await expect(page.locator('#pick-up-false')).not.toBeChecked();

    await page.check('#pick-up-false');
    await expect(page.locator('#pick-up-false')).toBeChecked();
    await expect(page.locator('#pick-up-true')).not.toBeChecked();

    // Test shipping options
    await page.check('#shipping-option-courier');
    await expect(page.locator('#shipping-option-courier')).toBeChecked();
    await expect(page.locator('#shipping-option-post')).not.toBeChecked();

    await page.check('#shipping-option-post');
    await expect(page.locator('#shipping-option-post')).toBeChecked();
    await expect(page.locator('#shipping-option-courier')).not.toBeChecked();
  });
});