import { expect, test } from '@playwright/test';
import { drawer, open } from './helpers';

test('product page content', async ({ page }) => {
  await open(page, '/product/w-jeans-1');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Low-Rise Butterfly Jeans');
  await expect(page.getByText('$52', { exact: true }).last()).toBeVisible();
  await expect(page.getByText('Baggy jeans & jorts', { exact: true })).toBeVisible();
});

test('"Back to shop" returns to the catalog', async ({ page }) => {
  await open(page, '/product/w-jeans-1');
  await page.getByRole('link', { name: /Back to shop/ }).click();
  await expect(page).toHaveURL('/shop');
});

test.describe('size buttons', () => {
  test('M is selected by default', async ({ page }) => {
    await open(page, '/product/w-jeans-1');
    await expect(page.getByRole('button', { name: 'M', exact: true })).toHaveAttribute('aria-pressed', 'true');
  });

  for (const size of ['XS', 'S', 'M', 'L', 'XL']) {
    test(`select ${size}`, async ({ page }) => {
      await open(page, '/product/w-jeans-1');
      await page.getByRole('button', { name: size, exact: true }).click();
      await expect(page.getByRole('button', { name: size, exact: true })).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('button[aria-pressed="true"]')).toHaveCount(1);
    });
  }

  test('chosen size ends up in the bag', async ({ page }) => {
    await open(page, '/product/w-jeans-1');
    await page.getByRole('button', { name: 'XL', exact: true }).click();
    await page.getByRole('button', { name: 'Add to bag' }).click();
    await expect(drawer(page)).toContainText('Size XL');
  });
});

test('related products link to other products of the same category', async ({ page }) => {
  await open(page, '/product/w-jeans-1');
  const related = page.getByRole('heading', { name: 'You may also like' }).locator('xpath=following-sibling::div//a');
  await expect(related).toHaveCount(3);
  await related.first().click();
  await expect(page).toHaveURL(/\/product\/(?!w-jeans-1$)/);
});
