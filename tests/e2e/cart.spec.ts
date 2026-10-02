import { expect, test } from '@playwright/test';
import { addProduct, badge, drawer, hydrated, open } from './helpers';

const subtotal = (page: import('@playwright/test').Page) =>
  drawer(page).getByText('Subtotal').locator('xpath=following-sibling::span');

test.describe('opening and closing', () => {
  test('cart icon opens an empty drawer', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'Cart' }).click();
    await expect(drawer(page)).toBeVisible();
    await expect(drawer(page)).toContainText('Your bag is empty.');
    await expect(badge(page)).toHaveCount(0);
  });

  test('X button closes', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'Cart' }).click();
    await drawer(page).getByRole('button', { name: 'Close' }).click();
    await expect(drawer(page)).toHaveCount(0);
  });

  test('clicking the overlay closes, clicking the panel does not', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'Cart' }).click();
    await drawer(page).getByText('Your bag', { exact: true }).click();
    await expect(drawer(page)).toBeVisible();
    await page.mouse.click(10, 300);
    await expect(drawer(page)).toHaveCount(0);
  });

  test('Escape closes', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'Cart' }).click();
    await page.keyboard.press('Escape');
    await expect(drawer(page)).toHaveCount(0);
  });

  test('"Start shopping" goes to the catalog and closes the drawer', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'Cart' }).click();
    await drawer(page).getByRole('link', { name: 'Start shopping' }).click();
    await expect(page).toHaveURL('/shop');
    await expect(drawer(page)).toHaveCount(0);
  });
});

test.describe('adding and removing', () => {
  test('Add to bag opens the drawer with the line and subtotal', async ({ page }) => {
    await addProduct(page, 'w-jeans-1', 'S');
    await expect(drawer(page)).toBeVisible();
    await expect(drawer(page)).toContainText('Low-Rise Butterfly Jeans');
    await expect(drawer(page)).toContainText('Size S · Qty 1 · $52');
    await expect(subtotal(page)).toHaveText('$52');
    await expect(badge(page)).toHaveText('1');
  });

  test('same product and size increments quantity', async ({ page }) => {
    await addProduct(page);
    await drawer(page).getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: 'Add to bag' }).click();
    await expect(drawer(page)).toContainText('Qty 2 · $104');
    await expect(badge(page)).toHaveText('2');
  });

  test('different sizes are separate lines', async ({ page }) => {
    await addProduct(page, 'w-jeans-1', 'S');
    await drawer(page).getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: 'L', exact: true }).click();
    await page.getByRole('button', { name: 'Add to bag' }).click();
    await expect(drawer(page).getByRole('button', { name: /^Remove/ })).toHaveCount(2);
    await expect(badge(page)).toHaveText('2');
  });

  test('different products sum in the subtotal', async ({ page }) => {
    await addProduct(page, 'w-jeans-1');
    await drawer(page).getByRole('button', { name: 'Close' }).click();
    await page.goto('/product/w-sun-1');
    await hydrated(page);
    await page.getByRole('button', { name: 'Add to bag' }).click();
    await expect(subtotal(page)).toHaveText('$70');
  });

  test('trash button removes a line and shows the empty state', async ({ page }) => {
    await addProduct(page);
    await drawer(page).getByRole('button', { name: 'Remove Low-Rise Butterfly Jeans' }).click();
    const confirm = page.getByRole('alertdialog', { name: 'Are you sure?' });
    await expect(confirm).toContainText('Remove Low-Rise Butterfly Jeans (size M) from your bag?');
    await confirm.getByRole('button', { name: 'Yes, remove' }).click();
    await expect(drawer(page)).toContainText('Your bag is empty.');
    await expect(badge(page)).toHaveCount(0);
  });

  test('answering No keeps the line', async ({ page }) => {
    await addProduct(page);
    await drawer(page).getByRole('button', { name: 'Remove Low-Rise Butterfly Jeans' }).click();
    await page.getByRole('alertdialog', { name: 'Are you sure?' }).getByRole('button', { name: 'No' }).click();
    await expect(page.getByRole('alertdialog')).toHaveCount(0);
    await expect(drawer(page).getByRole('button', { name: 'Remove Low-Rise Butterfly Jeans' })).toBeVisible();
    await expect(badge(page)).toHaveText('1');
  });

  test('Escape closes the confirmation but keeps the bag open', async ({ page }) => {
    await addProduct(page);
    await drawer(page).getByRole('button', { name: 'Remove Low-Rise Butterfly Jeans' }).click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('alertdialog')).toHaveCount(0);
    await expect(drawer(page)).toBeVisible();
  });

  test('Checkout button is shown when the bag has items', async ({ page }) => {
    await addProduct(page);
    await expect(drawer(page).getByRole('button', { name: 'Checkout' })).toBeEnabled();
  });

  test('Checkout shows the "not available yet" notice', async ({ page }) => {
    await addProduct(page);
    await drawer(page).getByRole('button', { name: 'Checkout' }).click();
    await expect(drawer(page).getByRole('status')).toContainText('isn’t available yet');
  });

  test('line item shows the product image', async ({ page }) => {
    await addProduct(page, 'w-jeans-1', 'S');
    await expect(drawer(page).getByRole('img', { name: 'Low-Rise Butterfly Jeans' })).toBeVisible();
  });

  test('line item is clickable and opens the product page', async ({ page }) => {
    await addProduct(page, 'w-jeans-1', 'S');
    await drawer(page).getByRole('link', { name: /Low-Rise Butterfly Jeans/ }).click();
    await expect(page).toHaveURL('/product/w-jeans-1');
    await expect(drawer(page)).toHaveCount(0);
  });
});

test.describe('persistence', () => {
  test('bag survives a reload', async ({ page }) => {
    await addProduct(page);
    await page.reload();
    await hydrated(page);
    await expect(badge(page)).toHaveText('1');
    await page.getByRole('button', { name: 'Cart' }).click();
    await expect(drawer(page)).toContainText('Low-Rise Butterfly Jeans');
  });

  test('bag survives client-side navigation and the drawer closes', async ({ page }) => {
    await addProduct(page);
    await page.keyboard.press('Escape');
    await page.getByRole('navigation').getByRole('link', { name: 'Womens', exact: true }).click();
    await expect(page).toHaveURL(/gender=women/);
    await expect(drawer(page)).toHaveCount(0);
    await expect(badge(page)).toHaveText('1');
  });
});
