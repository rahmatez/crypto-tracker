import { test, expect } from '@playwright/test';

test('home page loads successfully', async ({ page }) => {
  await page.goto('/');
  
  // Wait for the header to be visible
  await expect(page.getByText('CryptoTracker')).toBeVisible();
  
  // Check if page loaded without errors
  await expect(page).toHaveTitle(/CryptoTracker/);
});

test('watchlist navigation works', async ({ page }) => {
  await page.goto('/');
  
  // Wait for the page to load
  await expect(page.getByText('CryptoTracker')).toBeVisible();
  
  // Click on watchlist link
  await page.getByRole('link', { name: /watchlist/i }).click();
  
  // Check if we're on the watchlist page
  await expect(page).toHaveURL(/\/watchlist/);
});
