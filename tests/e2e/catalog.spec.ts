import { expect, test, type Page } from '@playwright/test';
import { open } from './helpers';

const active = /bg-ink/;
const chip = (page: Page, name: string) => page.locator('main').getByRole('link', { name, exact: true });
const cards = (page: Page) => page.locator('main a[href^="/product/"]');

test('shows all 110 products by default', async ({ page }) => {
  await open(page, '/shop');
  await expect(cards(page)).toHaveCount(110);
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
    await expect(cards(page)).toHaveCount(53);
    await expect(page.locator('a[href^="/product/m-"]')).toHaveCount(0);
  });

  test("Men's = men + unisex", async ({ page }) => {
    await open(page, '/shop');
    await chip(page, "Men's").click();
    await expect(page).toHaveURL('/shop?gender=men');
    await expect(cards(page)).toHaveCount(57);
    await expect(page.locator('a[href^="/product/w-"]')).toHaveCount(0);
  });

  test('Everything resets the gender filter', async ({ page }) => {
    await open(page, '/shop?gender=men');
    await chip(page, 'Everything').click();
    await expect(page).toHaveURL('/shop');
    await expect(cards(page)).toHaveCount(110);
  });
});

test.describe('category chips', () => {
  const cases = [
    ['Baggy jeans & jorts', 'jeans', 12],
    ['Hoodies & jumpers', 'hoodies', 12],
    ['Jackets', 'jackets', 12],
    ['Crop tops & baby tees', 'tops', 14],
    ['Sunglasses', 'sunglasses', 8],
    ['Belts & beanies', 'belts', 16],
    ['Jewelry & rings', 'jewelry', 16],
    ['Bags', 'bags', 20],
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
    await expect(cards(page)).toHaveCount(110);
  });

  test('gender and category combine and are kept when switching', async ({ page }) => {
    await open(page, '/shop?gender=men');
    await chip(page, 'Baggy jeans & jorts').click();
    await expect(page).toHaveURL('/shop?gender=men&category=jeans');
    await expect(cards(page)).toHaveCount(6);
    await chip(page, "Women's").click();
    await expect(page).toHaveURL('/shop?gender=women&category=jeans');
    await expect(cards(page)).toHaveCount(6);
  });
});

test.describe('accessories are split by gender', () => {
  const cases = [
    ['bags', 12, 8],
    ['sunglasses', 4, 4],
    ['belts', 8, 8],
    ['jewelry', 8, 8],
  ] as const;
  for (const [category, men, women] of cases) {
    test(`men's ${category} are only shown under Men's`, async ({ page }) => {
      await open(page, `/shop?gender=men&category=${category}`);
      await expect(cards(page)).toHaveCount(men);
      await expect(page.locator('main a[href^="/product/w-"]')).toHaveCount(0);
    });

    test(`women's ${category} are only shown under Women's`, async ({ page }) => {
      await open(page, `/shop?gender=women&category=${category}`);
      await expect(cards(page)).toHaveCount(women);
      await expect(page.locator('main a[href^="/product/m-"]')).toHaveCount(0);
    });
  }
});

test('accessories collection groups four categories', async ({ page }) => {
  await open(page, '/shop?category=accessories');
  await expect(cards(page)).toHaveCount(60);
});

test('product card opens its product page', async ({ page }) => {
  await open(page, '/shop');
  await page.locator('a[href="/product/w-bag-1"]').click();
  await expect(page).toHaveURL('/product/w-bag-1');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Baguette Chain Bag');
});
