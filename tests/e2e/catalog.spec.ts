import { expect, test, type Page } from '@playwright/test';
import { open } from './helpers';

const active = /bg-ink/;
const chip = (page: Page, name: string) => page.locator('main').getByRole('link', { name, exact: true });
const cards = (page: Page) => page.locator('main a[href^="/product/"]');

test('shows all 25 products by default', async ({ page }) => {
  await open(page, '/shop');
  await expect(cards(page)).toHaveCount(25);
  await expect(chip(page, 'Everything')).toHaveClass(active);
  await expect(chip(page, 'All')).toHaveClass(active);
});

test.describe('gender chips', () => {
  test("Women's = women + unisex", async ({ page }) => {
    await open(page, '/shop');
    await chip(page, "Women's").click();
    await expect(page).toHaveURL('/shop?gender=women');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText("Women's Y2K");
    await expect(chip(page, "Women's")).toHaveClass(active);
    await expect(cards(page)).toHaveCount(17);
    await expect(page.locator('a[href^="/product/m-"]')).toHaveCount(0);
  });

  test("Men's = men + unisex", async ({ page }) => {
    await open(page, '/shop');
    await chip(page, "Men's").click();
    await expect(page).toHaveURL('/shop?gender=men');
    await expect(cards(page)).toHaveCount(16);
    await expect(page.locator('a[href^="/product/w-"]')).toHaveCount(0);
  });

  test('Everything resets the gender filter', async ({ page }) => {
    await open(page, '/shop?gender=men');
    await chip(page, 'Everything').click();
    await expect(page).toHaveURL('/shop');
    await expect(cards(page)).toHaveCount(25);
  });
});

test.describe('category chips', () => {
  const cases = [
    ['Baggy jeans & jorts', 'jeans', 4],
    ['Hoodies & jumpers', 'hoodies', 4],
    ['Jackets', 'jackets', 2],
    ['Crop tops & baby tees', 'tops', 7],
    ['Sunglasses', 'sunglasses', 2],
    ['Belts & beanies', 'belts', 2],
    ['Jewelry & rings', 'jewelry', 2],
    ['Bags', 'bags', 2],
  ] as const;
  for (const [label, key, count] of cases) {
    test(`"${label}" filters to ${count}`, async ({ page }) => {
      await open(page, '/shop');
      await chip(page, label).click();
      await expect(page).toHaveURL(`/shop?category=${key}`);
      await expect(chip(page, label)).toHaveClass(active);
      await expect(cards(page)).toHaveCount(count);
    });
  }

  test('"All" clears the category filter', async ({ page }) => {
    await open(page, '/shop?category=bags');
    await chip(page, 'All').click();
    await expect(page).toHaveURL('/shop');
    await expect(cards(page)).toHaveCount(25);
  });

  test('gender and category combine and are kept when switching', async ({ page }) => {
    await open(page, '/shop?gender=men');
    await chip(page, 'Baggy jeans & jorts').click();
    await expect(page).toHaveURL('/shop?gender=men&category=jeans');
    await expect(cards(page)).toHaveCount(2);
    await chip(page, "Women's").click();
    await expect(page).toHaveURL('/shop?gender=women&category=jeans');
    await expect(cards(page)).toHaveCount(2);
  });
});

test('accessories collection groups four categories', async ({ page }) => {
  await open(page, '/shop?category=accessories');
  await expect(cards(page)).toHaveCount(8);
});

test('product card opens its product page', async ({ page }) => {
  await open(page, '/shop');
  await page.locator('a[href="/product/u-bag-1"]').click();
  await expect(page).toHaveURL('/product/u-bag-1');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Baguette Chain Bag');
});
