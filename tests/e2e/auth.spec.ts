import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000')
})

test('navigate to login page', async ({ page }) => {
  await page.click('text=Iniciar sesión')

  await expect(page).toHaveURL(/login/)
})

test('login with invalid credentials', async ({ page }) => {
  await page.click('text=Iniciar sesión')
  await page.fill('input[name="username"]', 'invalid-username')
  await page.fill('input[name="password"]', 'invalid-password')
  await page.click('button[type="submit"]')

  expect(page.getByText('Credenciales inválidas')).not.toBeNull()
})

test('login with valid credentials', async ({ page }) => {
  await page.click('text=Iniciar sesión')
  await page.fill('input[name="username"]', 'admin')
  await page.fill('input[name="password"]', 'contra123')
  await page.click('button[type="submit"]')

  await page.waitForNavigation()
  await expect(page).toHaveURL(/dashboard/)
})

test('logout', async ({ page }) => {
  await page.click('text=Iniciar sesión')
  await page.fill('input[name="username"]', 'admin')
  await page.fill('input[name="password"]', 'contra123')
  await page.click('button[type="submit"]')

  await page.waitForNavigation()
  await page.click('button[aria-haspopup="menu"]')
  await page.click('text=Cerrar sesión')

  await expect(page).toHaveURL(/login/)
})
