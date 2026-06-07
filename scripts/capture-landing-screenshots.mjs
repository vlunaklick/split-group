import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000'
const outputDir = path.join(process.cwd(), 'public/landing')
const username = process.env.E2E_USERNAME ?? 'admin'
const password = process.env.E2E_PASSWORD ?? 'contra123'
const THEME_KEY = 'split-group-theme'

async function login (page) {
  await page.goto(`${baseURL}/login`)
  await page.fill('input[name="username"]', username)
  await page.fill('input[name="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/dashboard/)
}

async function capture (page, url, filename, selector) {
  await page.goto(`${baseURL}${url}`)
  await page.waitForLoadState('networkidle')
  const target = selector ? page.locator(selector).first() : page.locator('main').first()
  await target.waitFor({ state: 'visible', timeout: 15000 })

  const box = await target.boundingBox()
  if (!box) throw new Error(`Could not measure ${selector ?? 'main'} for ${filename}`)

  await page.screenshot({
    path: path.join(outputDir, filename),
    clip: box
  })
}

async function captureThemeSet (browser, theme) {
  const context = await browser.newContext()
  await context.addInitScript(({ key, theme }) => {
    localStorage.setItem(key, theme)
  }, { key: THEME_KEY, theme })

  const page = await context.newPage({ viewport: { width: 1280, height: 800 } })

  try {
    await login(page)
    await capture(page, '/dashboard', `dashboard-${theme}.png`, 'main')

    await page.locator('a[href^="/groups/"]').filter({ hasNot: page.locator('[href*="/spendings/"]') }).locator('visible=true').first().click()
    await page.waitForURL(/\/groups\//)
    await capture(page, page.url().replace(baseURL, ''), `group-home-${theme}.png`, 'main')

    await page.getByRole('navigation').getByRole('link', { name: 'Gastos' }).click()
    await page.waitForURL(/\/spendings/)
    await capture(page, page.url().replace(baseURL, ''), `spendings-${theme}.png`, 'main')
  } finally {
    await context.close()
  }
}

await mkdir(outputDir, { recursive: true })

const browser = await chromium.launch()

try {
  for (const theme of ['light', 'dark']) {
    await captureThemeSet(browser, theme)
  }
  console.log('Landing screenshots saved to public/landing/ (full main, light + dark)')
} finally {
  await browser.close()
}
