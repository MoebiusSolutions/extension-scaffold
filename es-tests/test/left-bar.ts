import { Browser, BrowserContext, chromium, Page } from 'playwright';

import { test } from 'uvu';
import * as assert from 'uvu/assert';

let browser: Browser | undefined
let context: BrowserContext | undefined
let page: Page = {} as Page

test.before(async () => {
  browser = await chromium.launch({
    // headless: false,
    // slowMo: 1000,
  })
  context = await browser.newContext();

  page = await context.newPage();
  await page.goto('http://localhost:8081/');
})

test.after(async () => {
  await context?.close();
  await browser?.close();
})

test('Initial left-bar activeId', async () => {
  assert.ok(await page.isVisible('text=MyPanel - rollup'))
})

test('click Snowpack Left button', async () => {
  await page.click('button[title="Snowpack Left"]')
  assert.ok(await page.isVisible('text=Left example from snowpack'))

  // Clicking the same button will close the panel
  await page.click('button[title="Snowpack Left"]')
  assert.ok(! await page.isVisible('text=Left example from snowpack'))

  // And again will open the panel
  await page.click('button[title="Snowpack Left"]')
  assert.ok(await page.isVisible('text=Left example from snowpack'))
})

test('click Rollup Left button', async () => {
  await page.click('button[title="Rollup Left"]')
  assert.ok(await page.isVisible('text=MyPanel - rollup'))

  await page.click('div:text("MyPanel") button:text("X")')
  assert.ok(! await page.isVisible('text=MyPanel - rollup'))

  await page.click('button[title="Rollup Left"]')
  assert.ok(await page.isVisible('text=MyPanel - rollup'))
})

test.run();
