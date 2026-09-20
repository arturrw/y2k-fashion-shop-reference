import { expect, test } from '@playwright/test';
import { open } from './helpers';

test.describe('header', () => {
  test('logo returns home', async ({ page }) => {
    await open(page, '/shop');
    await page.getByRole('link', { name: 'DCS Y2K' }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Cyber Y2K is back.' })).toBeVisible();
  });

  const nav = [
    ['All', '/shop', 'All Y2K'],
    ['Mens', '/shop?gender=men', "Men's Y2K"],
    ['Womens', '/shop?gender=women', "Women's Y2K"],
    ['Themed Collections', '/shop?category=accessories', 'All Y2K'],
    ['New Collections', '/shop', 'All Y2K'],
  ] as const;
  for (const [label, url, title] of nav) {
    test(`nav link "${label}"`, async ({ page }) => {
      await open(page, '/');
      await page.getByRole('navigation').getByRole('link', { name: label, exact: true }).click();
      await expect(page).toHaveURL(url);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    });
  }

  test('search icon opens the catalog', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('link', { name: 'Search' }).click();
    await expect(page).toHaveURL('/shop');
  });

  test('account button is present and enabled', async ({ page }) => {
    await open(page, '/');
    await expect(page.getByRole('button', { name: 'Account' })).toBeEnabled();
  });

  test('header stays mounted across navigation', async ({ page }) => {
    await open(page, '/');
    await page.evaluate(() => document.querySelector('body > header')!.setAttribute('data-marker', '1'));
    await page.getByRole('navigation').getByRole('link', { name: 'Mens', exact: true }).click();
    await expect(page).toHaveURL(/gender=men/);
    await expect(page.locator('body > header')).toHaveAttribute('data-marker', '1');
  });
});

test.describe('header dropdown menus', () => {
  const menus = [
    ['All', 8, 'Sunglasses', '/shop?category=sunglasses'],
    ['Mens', 8, 'Bags', '/shop?gender=men&category=bags'],
    ['Womens', 8, 'Hoodies & jumpers', '/shop?gender=women&category=hoodies'],
    ['Themed Collections', 5, 'Belts & beanies', '/shop?category=belts'],
    ['New Collections', 2, 'Trending now', '/#trending'],
  ] as const;

  for (const [label, count, item, url] of menus) {
    test(`"${label}" opens on hover with ${count} links and navigates`, async ({ page }) => {
      await open(page, '/');
      const tab = page.locator('[data-main-nav] > div', { has: page.getByRole('link', { name: label, exact: true }) });
      const links = tab.locator('[data-dropdown] a');
      await expect(links.first()).toBeHidden();
      await tab.getByRole('link', { name: label, exact: true }).hover();
      await expect(links).toHaveCount(count);
      await expect(links.first()).toBeVisible();
      await links.filter({ hasText: new RegExp(`^${item}$`) }).click();
      await expect(page).toHaveURL(url);
    });
  }

  test('menu opens with keyboard focus', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('link', { name: 'Womens', exact: true }).focus();
    await expect(page.getByRole('link', { name: "All women's" })).toBeVisible();
  });

  test('menu closes after navigating while the pointer stays over it', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('link', { name: 'Mens', exact: true }).hover();
    await page.getByRole('link', { name: 'Bags' }).first().click();
    await expect(page).toHaveURL('/shop?gender=men&category=bags');
    await expect(page.getByRole('link', { name: "All men's" })).toBeHidden();
  });
});

test.describe('home', () => {
  test('hero buttons', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('link', { name: "Shop women's" }).click();
    await expect(page).toHaveURL('/shop?gender=women');
    await page.goBack();
    await page.getByRole('link', { name: "Shop men's" }).click();
    await expect(page).toHaveURL('/shop?gender=men');
  });

  const categories = [
    ['Baggy jeans & jorts', 'jeans'],
    ['Hoodies & jumpers', 'hoodies'],
    ['Crop tops & baby tees', 'tops'],
    ['Sunglasses', 'sunglasses'],
    ['Belts & beanies', 'belts'],
    ['Jewelry & rings', 'jewelry'],
    ['Bags', 'bags'],
  ] as const;
  for (const [label, key] of categories) {
    test(`category tile "${label}"`, async ({ page }) => {
      await open(page, '/');
      await page.locator('main').getByRole('link', { name: label, exact: true }).click();
      await expect(page).toHaveURL(`/shop?category=${key}`);
    });
  }

  test('trending grid shows 10 products and opens one', async ({ page }) => {
    await open(page, '/');
    const cards = page.locator('main a[href^="/product/"]');
    await expect(cards).toHaveCount(10);
    await cards.first().click();
    await expect(page).toHaveURL(/\/product\//);
  });

  test('"Shop now" banner button', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('link', { name: 'Shop now' }).click();
    await expect(page).toHaveURL('/shop');
  });
});

test.describe('footer & errors', () => {
  test('footer has all four columns with links', async ({ page }) => {
    await open(page, '/');
    const footer = page.getByRole('contentinfo');
    for (const title of ['Shop', 'Help', 'About', 'Follow']) {
      await expect(footer.getByRole('heading', { name: title })).toBeVisible();
    }
    await expect(footer.getByRole('link')).toHaveCount(14);
  });

  test('unknown product returns 404', async ({ page }) => {
    const res = await page.goto('/product/does-not-exist');
    expect(res?.status()).toBe(404);
  });
});
