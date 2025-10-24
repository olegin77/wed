import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage without redirect', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that we're still on the homepage (not redirected to /dashboard)
    expect(page.url()).toBe('http://localhost:3000/');
    
    // Check for WeddingTech branding
    await expect(page.locator('text=WeddingTech')).toBeVisible();
    
    // Check for main heading
    await expect(page.locator('h1')).toContainText('Launch your marketplace');
  });

  test('should not auto-redirect to dashboard without session', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Wait a bit to ensure no redirect happens
    await page.waitForTimeout(1000);
    
    // Verify we're still on homepage
    const url = page.url();
    expect(url).not.toContain('/dashboard');
    expect(url).toBe('http://localhost:3000/');
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Check for catalog link
    const catalogButton = page.locator('button:has-text("Открыть каталог")');
    await expect(catalogButton).toBeVisible();
    
    // Check for partners link
    const partnersLink = page.locator('a:has-text("Узнать о подходе к онбордингу")');
    await expect(partnersLink).toBeVisible();
  });
});
