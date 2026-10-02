import { expect, test } from '@playwright/test';
import { open } from './helpers';

test.describe('footer pages', () => {
  const pages = [
    ['Shipping & returns', '/shipping-returns'],
    ['Size guide', '/size-guide'],
    ['Track my order', '/track-order'],
    ['Contact us', '/contact'],
    ['Our story', '/about'],
    ['Sustainability', '/sustainability'],
    ['Careers', '/careers'],
  ] as const;
  for (const [label, url] of pages) {
    test(`"${label}" opens its page`, async ({ page }) => {
      await open(page, '/');
      await page.getByRole('contentinfo').getByRole('link', { name: label, exact: true }).click();
      await expect(page).toHaveURL(url);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(label);
    });
  }

  test('no footer link points nowhere', async ({ page }) => {
    await open(page, '/');
    const hrefs = await page.getByRole('contentinfo').getByRole('link').evaluateAll((els) => els.map((a) => a.getAttribute('href')));
    expect(hrefs.filter((h) => !h || h === '#')).toEqual([]);
  });

  test('size guide lists every size', async ({ page }) => {
    await open(page, '/size-guide');
    for (const size of ['XS', 'S', 'M', 'L', 'XL']) await expect(page.getByRole('cell', { name: size, exact: true })).toBeVisible();
  });

  test('track order explains how to get the status', async ({ page }) => {
    await open(page, '/track-order');
    await page.getByLabel('Order number').fill('DCS-1');
    await page.getByLabel('Email').fill('me@example.com');
    await page.getByRole('button', { name: 'Track order' }).click();
    await expect(page.getByRole('status')).toContainText('isn’t available yet');
  });

  test('unknown page returns 404', async ({ page }) => {
    const res = await page.goto('/definitely-not-a-page');
    expect(res?.status()).toBe(404);
  });
});

test.describe('shortcuts', () => {
  test('shop title shows everything', async ({ page }) => {
    await open(page, '/shop?gender=women&category=tops');
    await page.getByRole('heading', { level: 1 }).getByRole('link').click();
    await expect(page).toHaveURL('/shop');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('All Y2K');
  });

  test('category on a product page opens that category for the same gender', async ({ page }) => {
    await open(page, '/product/w-top-1');
    await page.locator('main').getByRole('link', { name: 'Crop tops & baby tees', exact: true }).click();
    await expect(page).toHaveURL('/shop?gender=women&category=tops');
  });
});

test.describe('header & hero', () => {
  test('header turns see-through once the page scrolls', async ({ page }) => {
    await open(page, '/shop');
    const header = page.locator('body > header');
    await expect(header).not.toHaveAttribute('data-scrolled');
    await page.mouse.wheel(0, 800);
    await expect(header).toHaveAttribute('data-scrolled', '');
  });


  test('hero indicators switch looks', async ({ page }) => {
    await open(page, '/');
    const dots = page.getByRole('group', { name: 'Choose a look' }).getByRole('button');
    await expect(dots).toHaveCount(7);
    await expect(page.getByText('Look 01 / 07')).toBeVisible();
    await dots.nth(2).click();
    await expect(page.getByText('Look 03 / 07')).toBeVisible();
    await expect(dots.nth(2)).toHaveAttribute('aria-current', 'true');
  });
});
