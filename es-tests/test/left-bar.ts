import { Browser, BrowserContext, chromium, Page } from 'playwright';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { setUp, tearDown } from '../src/playwright';
import type { Context } from '../src/playwright'

const LeftBar = suite<Context>('LeftBar', {
  page: {} as Page
})

LeftBar.before(setUp)

LeftBar.after(tearDown)

LeftBar('should initially have rollup as active panel', async ctx => {
  const { page } = ctx
  assert.ok(await page.isVisible('text=MyPanel - rollup'))
})

LeftBar('click Snowpack Left button', async ctx => {
  const { page } = ctx
  await page.click('button[title="Snowpack Left"]')
  assert.ok(await page.isVisible('text=Left example from snowpack'))

  // Clicking the same button will close the panel
  await page.click('button[title="Snowpack Left"]')
  assert.ok(! await page.isVisible('text=Left example from snowpack'))

  // And again will open the panel
  await page.click('button[title="Snowpack Left"]')
  assert.ok(await page.isVisible('text=Left example from snowpack'))
})

LeftBar('click Rollup Left button', async ctx => {
  const { page } = ctx
  await page.click('button[title="Rollup Left"]')
  assert.ok(await page.isVisible('text=MyPanel - rollup'))

  await page.click('div:text("MyPanel") button:text("X")')
  assert.ok(! await page.isVisible('text=MyPanel - rollup'))

  await page.click('button[title="Rollup Left"]')
  assert.ok(await page.isVisible('text=MyPanel - rollup'))
})

LeftBar.run();
