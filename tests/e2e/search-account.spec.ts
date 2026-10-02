import { expect, test } from '@playwright/test';
import { open } from './helpers';

test.describe('search', () => {
  const dialog = (page: import('@playwright/test').Page) => page.getByRole('dialog', { name: 'Search' });
  const input = (page: import('@playwright/test').Page) => page.getByRole('searchbox', { name: 'Search products' });

  test('opens with a focused input you can type in', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(dialog(page)).toBeVisible();
    await expect(input(page)).toBeFocused();
    await page.keyboard.type('chrome');
    await expect(input(page)).toHaveValue('chrome');
  });

  test('shows live suggestions and opens a product', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'Search' }).click();
    await input(page).fill('baguette');
    const suggestions = page.getByRole('list', { name: 'Suggestions' });
    await expect(suggestions.getByRole('link', { name: /Baguette Chain Bag/ })).toBeVisible();
    await suggestions.getByRole('link', { name: /Baguette Chain Bag/ }).click();
    await expect(page).toHaveURL('/product/u-bag-1');
    await expect(dialog(page)).toHaveCount(0);
  });

  test('Enter opens the results page filtered by the query', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'Search' }).click();
    await input(page).fill('baguette');
    await input(page).press('Enter');
    await expect(page).toHaveURL('/shop?q=baguette');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Results for “baguette”');
    await expect(page.locator('main a[href^="/product/"]')).toHaveCount(1);
  });

  test('"See all results" link goes to the results page', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'Search' }).click();
    await input(page).fill('hoodie');
    await page.getByRole('link', { name: 'See all results' }).click();
    await expect(page).toHaveURL('/shop?q=hoodie');
    await expect(page.locator('main a[href^="/product/"]')).toHaveCount(4);
  });

  test('empty results are explained', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'Search' }).click();
    await input(page).fill('zzzzzz');
    await expect(dialog(page)).toContainText('No products found for “zzzzzz”.');
    await input(page).press('Enter');
    await expect(page.getByText('No products found for “zzzzzz”.')).toBeVisible();
  });

  test('wildcards typed by the user are treated literally', async ({ page }) => {
    await open(page, '/shop?q=%25');
    await expect(page.locator('main a[href^="/product/"]')).toHaveCount(0);
  });

  test('X, Escape and overlay close it', async ({ page }) => {
    await open(page, '/');
    const open_ = () => page.getByRole('button', { name: 'Search', exact: true }).click();
    await open_();
    await page.getByRole('button', { name: 'Close search' }).click();
    await expect(dialog(page)).toHaveCount(0);
    await open_();
    await page.keyboard.press('Escape');
    await expect(dialog(page)).toHaveCount(0);
    await open_();
    await page.mouse.click(5, 500);
    await expect(dialog(page)).toHaveCount(0);
  });

  test('empty submit does nothing', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'Search' }).click();
    await input(page).press('Enter');
    await expect(page).toHaveURL('/');
    await expect(dialog(page)).toBeVisible();
  });
});

test.describe('account', () => {
  const dialog = (page: import('@playwright/test').Page, name = 'Log in') => page.getByRole('dialog', { name });

  test('button opens the login modal', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'Account' }).click();
    await expect(dialog(page)).toBeVisible();
    await expect(dialog(page).getByRole('heading')).toHaveText('Log in to DCS Y2K');
  });

  test('X, Escape and overlay close it', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'Account' }).click();
    await dialog(page).getByRole('button', { name: 'Close' }).click();
    await expect(dialog(page)).toHaveCount(0);
    await page.getByRole('button', { name: 'Account' }).click();
    await page.keyboard.press('Escape');
    await expect(dialog(page)).toHaveCount(0);
    await page.getByRole('button', { name: 'Account' }).click();
    await page.mouse.click(5, 5);
    await expect(dialog(page)).toHaveCount(0);
  });

  test('validates email and password', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'Account' }).click();
    await dialog(page).getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByRole('alert')).toHaveText('Enter a valid email address.');
    await dialog(page).getByLabel('Email').fill('me@example.com');
    await dialog(page).getByLabel('Password').fill('short');
    await dialog(page).getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByRole('alert')).toHaveText('Password must be at least 8 characters.');
  });

  test('valid credentials show the "not available yet" notice', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'Account' }).click();
    await dialog(page).getByLabel('Email').fill('me@example.com');
    await dialog(page).getByLabel('Password').fill('longenough1');
    await dialog(page).getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByRole('status')).toContainText('aren’t available yet');
    await expect(page.getByRole('alert')).toHaveCount(0);
  });

  test('switches between log in and create account', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'Account' }).click();
    await dialog(page).getByRole('button', { name: 'Create an account' }).click();
    await expect(dialog(page, 'Create account').getByRole('heading')).toHaveText('Create your account');
    await dialog(page, 'Create account').getByRole('button', { name: 'Log in' }).click();
    await expect(dialog(page)).toBeVisible();
  });
});

test.describe('account registration', () => {
  const registerDialog = (page: import('@playwright/test').Page) => page.getByRole('dialog', { name: 'Create account' });

  test('validates email and password on the registration form', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'Account' }).click();
    await page.getByRole('button', { name: 'Create an account' }).click();
    await registerDialog(page).getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByRole('alert')).toHaveText('Enter a valid email address.');
    await registerDialog(page).getByLabel('Email').fill('newuser@example.com');
    await registerDialog(page).getByLabel('Password').fill('short');
    await registerDialog(page).getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByRole('alert')).toHaveText('Password must be at least 8 characters.');
  });

  test('submitting a valid registration shows the "not available yet" notice', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'Account' }).click();
    await page.getByRole('button', { name: 'Create an account' }).click();
    await registerDialog(page).getByLabel('Email').fill('newuser@example.com');
    await registerDialog(page).getByLabel('Password').fill('longenough1');
    await registerDialog(page).getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByRole('status')).toContainText('aren’t available yet');
    await expect(page.getByRole('alert')).toHaveCount(0);
  });

  test('closing and reopening the registration modal resets its state', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'Account' }).click();
    await page.getByRole('button', { name: 'Create an account' }).click();
    await registerDialog(page).getByLabel('Email').fill('newuser@example.com');
    await registerDialog(page).getByLabel('Password').fill('longenough1');
    await registerDialog(page).getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByRole('status')).toBeVisible();
    await registerDialog(page).getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: 'Account' }).click();
    await expect(page.getByRole('dialog', { name: 'Log in' }).getByRole('status')).toHaveCount(0);
  });
});
