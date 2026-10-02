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

  test('login modal covers the whole screen after scrolling', async ({ page }) => {
    await open(page, '/shop');
    await page.mouse.wheel(0, 1200);
    await expect(page.locator('body > header')).toHaveAttribute('data-scrolled', '');
    await page.getByRole('button', { name: 'Account' }).click();
    const dialog = page.getByRole('dialog', { name: 'Log in' });
    await expect(dialog).toBeInViewport({ ratio: 1 });
    const overlay = await dialog.locator('..').boundingBox();
    expect(overlay).toMatchObject({ y: 0, height: page.viewportSize()!.height });
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

test.describe('reviews', () => {
  test('product shows its live rating and reviews', async ({ page }) => {
    await open(page, '/product/w-jeans-1');
    await expect(page.locator('[data-rating-summary]')).toContainText(/\d\.\d/);
    await expect(page.getByRole('list', { name: 'Customer reviews' }).getByRole('listitem').first()).toBeVisible();
  });

  test('cards show the rating', async ({ page }) => {
    await open(page, '/shop?category=bags');
    await expect(page.locator('main a[href^="/product/"]').first()).toContainText('★');
  });

  test('a review needs a star rating', async ({ page }) => {
    await open(page, '/product/w-top-1');
    const form = page.getByRole('form', { name: 'Write a review' });
    await form.getByLabel('Name').fill('Tester');
    await form.getByLabel('Review').fill('Nice top');
    await form.getByRole('button', { name: 'Post review' }).click();
    await expect(form.getByRole('alert')).toHaveText('Choose a rating from 0.5 to 5 stars.');
  });

  test('posting a review adds it and updates the rating count', async ({ page }) => {
    await open(page, '/product/w-top-1');
    const countText = async () => (await page.locator('[data-rating-summary]').innerText()).match(/(\d+) reviews?/i)![1];
    const before = Number(await countText());
    const form = page.getByRole('form', { name: 'Write a review' });
    await form.getByRole('radio', { name: '5 stars', exact: true }).click();
    await form.getByLabel('Name').fill('E2E Tester');
    await form.getByLabel('Review').fill('Posted from the e2e suite.');
    await form.getByRole('button', { name: 'Post review' }).click();
    await expect(form.getByRole('status')).toHaveText('Thanks — your review is live.');
    await expect(page.getByRole('list', { name: 'Customer reviews' }).getByRole('listitem').first()).toContainText('Posted from the e2e suite.');
    await expect.poll(countText).toBe(String(before + 1));
  });

  test('the picker has five stars and allows half stars', async ({ page }) => {
    await open(page, '/product/w-top-2');
    const form = page.getByRole('form', { name: 'Write a review' });
    await expect(form.locator('[role=radiogroup] svg path')).toHaveCount(10); // 5 stars, each a grey and an ink layer
    await expect(form.getByRole('radio')).toHaveCount(10);
    await form.getByRole('radio', { name: '3.5 stars' }).click();
    await expect(form).toContainText('3.5 · Good');
    await form.getByLabel('Name').fill('Half Star');
    await form.getByLabel('Review').fill('Three and a half from the e2e suite.');
    await form.getByRole('button', { name: 'Post review' }).click();
    const first = page.getByRole('list', { name: 'Customer reviews' }).getByRole('listitem').first();
    await expect(first).toContainText('Three and a half from the e2e suite.');
    await expect(first.getByRole('img', { name: '3.5 out of 5 stars' })).toBeVisible();
  });

  test('the API rejects ratings that are out of range or not half steps', async ({ request }) => {
    for (const rating of [7, 0, 3.25]) {
      const res = await request.post('/api/reviews', { data: { productId: 'w-top-1', rating, author: 'x', body: 'hello' } });
      expect(res.status()).toBe(400);
    }
  });
});
