const { test, expect } = require('@playwright/test');

test.describe('Autentifikacija Flow', () => {
  
  test('Korisnik može da se registruje i prijavi', async ({ page }) => {
    // 1. Odi na registraciju
    await page.goto('http://localhost:5173/register');
    
    // 2. Popuni formu (generišemo unikatan username da test ne bi pao drugi put)
    const uniqueUser = `user_${Date.now()}`;
    await page.fill('input[name="username"]', uniqueUser);
    await page.fill('input[name="email"]', `${uniqueUser}@example.com`);
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    
    // 3. Klikni registraciju i sačekaj preusmeravanje na login
    await page.click('button[type="submit"]');
    await page.waitForURL('**/login');
    
    // 4. Prijavi se
    await page.fill('input[type="text"]', uniqueUser);
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // 5. Proveri da li smo na početnoj i da li Navbar vidi korisnika
    await page.waitForURL('http://localhost:5173/');
    const navbarUser = page.locator('.user-name');
    await expect(navbarUser).toContainText(`Bok, ${uniqueUser}`);
  });

  test('Neulogovan korisnik biva preusmeren sa checkout-a', async ({ page }) => {
    await page.goto('http://localhost:5173/checkout');
    await page.waitForURL('**/login');
    await expect(page.locator('h2')).toContainText('Dobrodošli nazad');
  });

});
