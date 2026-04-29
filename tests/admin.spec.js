const { test, expect } = require('@playwright/test');

test.describe('Admin Panel Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // 1. Prijava kao admin
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    // Uradi screenshot da vidimo zašto failuje
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-login-screenshot.png' });
    // Sačekaj da se pojavi element koji potvrđuje prijavu (npr. ime korisnika u navbaru)
    await expect(page.locator('.navbar-user')).toBeVisible();
  });

  test('Admin može da doda novi proizvod', async ({ page }) => {
    await page.click('a:has-text("Admin")');
    await page.waitForURL('**/admin');
    
    await page.click('a:has-text("+ Dodaj Novi Proizvod")');
    
    const uniqueProductName = `Test Proizvod ${Date.now()}`;
    await page.fill('input[name="name"]', uniqueProductName);
    await page.selectOption('select[name="category"]', 'Elektronika');
    await page.fill('input[name="price"]', '50000');
    await page.fill('input[name="stock"]', '10');
    await page.fill('input[name="imageUrl"]', 'https://picsum.photos/200');
    await page.fill('textarea[name="description"]', 'Opis test proizvoda');
    
    // Slušaj dijalog za uspeh
    page.on('dialog', dialog => dialog.accept());
    await page.click('button:has-text("Kreiraj Proizvod")');
    
    // Sačekaj da se prikaže tabela nakon redirekcije
    await expect(page.locator('.products-table')).toBeVisible();
    await expect(page.locator('.products-table')).toContainText(uniqueProductName);
  });

  test('Admin može da obriše proizvod', async ({ page }) => {
    await page.goto('http://localhost:5173/admin');
    
    // Uzmi ime prvog proizvoda iz tabele
    const firstRow = page.locator('.products-table tbody tr').first();
    const productName = await firstRow.locator('td:nth-child(3)').innerText();
    
    // Klikni obriši i prihvati confirm
    page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Da li ste sigurni');
        await dialog.accept();
    });
    
    await firstRow.locator('.btn-delete').click();
    
    // Proveri da proizvoda više nema
    await expect(page.locator('.products-table')).not.toContainText(productName);
  });

});
