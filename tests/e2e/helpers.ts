import { expect, type Page } from '@playwright/test';

/** React islands ignore clicks until hydrated; Astro drops `ssr` from <astro-island> when done. */
export async function hydrated(page: Page) {
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
}

export async function open(page: Page, path: string) {
  await page.goto(path);
  await hydrated(page);
}

export const drawer = (page: Page) => page.getByRole('complementary', { name: 'Your bag' });

export const badge = (page: Page) =>
  page.getByRole('button', { name: 'Cart' }).locator('xpath=following-sibling::span');

export async function addProduct(page: Page, id = 'w-jeans-1', size?: string) {
  await open(page, `/product/${id}`);
  if (size) await page.getByRole('button', { name: size, exact: true }).click();
  await page.getByRole('button', { name: 'Add to bag' }).click();
}
