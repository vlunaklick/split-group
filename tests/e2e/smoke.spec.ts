import { expect, test } from '@playwright/test'

const credentials = {
  username: process.env.E2E_USERNAME ?? 'admin',
  password: process.env.E2E_PASSWORD ?? 'contra123'
}

async function login (page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.fill('input[name="username"]', credentials.username)
  await page.fill('input[name="password"]', credentials.password)
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/dashboard/)
}

async function openFirstGroup (page: import('@playwright/test').Page) {
  const link = page.locator('a[href^="/groups/"]').filter({ hasNot: page.locator('[href*="/spendings/"]') }).locator('visible=true').first()
  await expect(link).toBeVisible()
  await link.click()
}

test.describe('Smoke', () => {
  test('dashboard shows overview after login', async ({ page }) => {
    await login(page)
    await expect(page.getByRole('heading', { name: 'Inicio' })).toBeVisible()
  })

  test('group home shows status and activity sections', async ({ page }) => {
    await login(page)
    await openFirstGroup(page)

    await expect(page.getByText('Grupo al día').or(page.getByText(/Quedan \d+ pagos/))).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Gastos' })).toBeVisible()
  })

  test('spendings page shows recurring panel', async ({ page }) => {
    await login(page)
    await openFirstGroup(page)
    await page.getByRole('link', { name: 'Gastos' }).click()

    await expect(page.getByRole('heading', { name: 'Recurrentes' })).toBeVisible()
  })

  test('forgive debt asks for confirmation', async ({ page }) => {
    await login(page)
    await openFirstGroup(page)

    const forgiveButton = page.getByRole('button', { name: 'Perdonar' }).first()
    if (!(await forgiveButton.isVisible())) {
      test.skip(true, 'No pending debts to forgive in seed data')
    }

    await forgiveButton.click()
    await expect(page.getByRole('alertdialog')).toContainText('¿Perdonar esta deuda?')
  })
})
