import { test, expect } from '@playwright/test';

test('kompletan tok kupovine', async ({ page }) => {
  // 1. Idi na početnu stranu
  await page.goto('http://localhost:5173');
  await expect(page).toHaveTitle(/VibeShop/);

  // 2. Pretraga proizvoda
  const searchInput = page.locator('input[placeholder="Pretraži proizvode..."]');
  await searchInput.fill('Laptop');
  await page.click('button:has-text("Traži")');

  // 3. Proveri da li ima rezultata i klikni na prvi proizvod
  await expect(page.locator('h3:has-text("Laptop Pro")')).toBeVisible();
  await page.click('h3:has-text("Laptop Pro")');

  // 4. Detalji proizvoda i dodavanje u korpu
  await expect(page.locator('h1:has-text("Laptop Pro")')).toBeVisible();
  await page.click('button:has-text("Dodaj u korpu")');

  // 5. Idi u korpu
  await page.click('a:has-text("Korpa")');
  await expect(page.locator('h3:has-text("Laptop Pro")')).toBeVisible();

  // 6. Checkout
  await page.click('a:has-text("Nastavi na plaćanje")');

  // 7. Popuni formu
  await page.fill('input[name="customerName"]', 'Test Korisnik');
  await page.fill('input[name="customerEmail"]', 'test@vibe.com');
  await page.fill('textarea[name="customerAddress"]', 'Test Adresa 123');

  // 8. Pošalji porudžbinu
  await page.click('button:has-text("Potvrdi porudžbinu")');

  // 9. Uspeh
  await expect(page.locator('h1:has-text("Porudžbina je uspešno poslata!")')).toBeVisible();
});
