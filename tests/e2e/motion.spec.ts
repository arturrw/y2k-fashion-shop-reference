import { expect, test, type Locator } from '@playwright/test';
import { addProduct, badge, drawer, open } from './helpers';

test.use({ reducedMotion: 'no-preference' });

const style = (loc: Locator, prop: 'animationName' | 'animationDelay') =>
  loc.evaluate((el, p) => getComputedStyle(el)[p], prop);

test('drawer slides in', async ({ page }) => {
  await addProduct(page);
  expect(await style(drawer(page), 'animationName')).toBe('slide-in-right');
});

test('cart badge pops when the count changes', async ({ page }) => {
  await addProduct(page);
  expect(await style(badge(page), 'animationName')).toBe('pop');
});

test('product cards fade up with a stagger', async ({ page }) => {
  await open(page, '/shop');
  const cards = page.locator('main a[href^="/product/"]');
  expect(await style(cards.first(), 'animationName')).toBe('fade-up');
  expect(await style(cards.first(), 'animationDelay')).toBe('0s');
  expect(await style(cards.nth(3), 'animationDelay')).not.toBe('0s');
});

test('page changes use Astro view transitions (no full reload)', async ({ page }) => {
  await open(page, '/');
  await page.evaluate(() => ((window as any).__spa = true));
  await page.getByRole('navigation').getByRole('link', { name: 'Mens', exact: true }).click();
  await expect(page).toHaveURL(/gender=men/);
  expect(await page.evaluate(() => (window as any).__spa)).toBe(true);
});

test('reduced motion disables the animations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page, '/shop');
  expect(await style(page.locator('main a[href^="/product/"]').first(), 'animationName')).toBe('none');
});

test('hero lookbook autoplays and does not pause on hover', async ({ page }) => {
  await open(page, '/');
  const fill = page.locator('.hero-fill[data-state="active"]');
  expect(await style(fill, 'animationName')).toBe('hero-progress');
  await page.locator('section').first().hover();
  expect(await fill.evaluate((el) => getComputedStyle(el).animationPlayState)).toBe('running');
});
