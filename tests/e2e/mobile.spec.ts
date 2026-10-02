import { expect, test } from '@playwright/test';
import { addProduct, drawer, open } from './helpers';

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

const pages = ['/', '/shop', '/shop?gender=women&category=tops', '/product/w-jeans-1', '/size-guide', '/contact'];
for (const path of pages) {
  test(`no sideways scrolling on ${path}`, async ({ page }) => {
    await open(page, path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });
}

test('desktop nav is replaced by the burger menu', async ({ page }) => {
  await open(page, '/');
  await expect(page.locator('[data-main-nav]')).toBeHidden();
  await page.getByRole('button', { name: 'Open menu' }).click();
  const menu = page.getByRole('dialog', { name: 'Menu' });
  await menu.getByRole('button', { name: 'Show Mens categories' }).click();
  await menu.getByRole('link', { name: 'Bags', exact: true }).click();
  await expect(page).toHaveURL('/shop?gender=men&category=bags');
  await expect(menu).toHaveCount(0);
});

test('burger menu closes with the X', async ({ page }) => {
  await open(page, '/shop');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('button', { name: 'Close menu' }).click();
  await expect(page.getByRole('dialog', { name: 'Menu' })).toHaveCount(0);
});

test('selected category chip is scrolled into view', async ({ page }) => {
  await open(page, '/shop?category=bags');
  await expect(page.locator('main').getByRole('link', { name: 'Bags', exact: true })).toBeInViewport();
});

test('bag drawer fits the screen', async ({ page }) => {
  await addProduct(page);
  const box = (await drawer(page).boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);
});
