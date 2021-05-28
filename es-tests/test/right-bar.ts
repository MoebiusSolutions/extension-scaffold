import { Browser, BrowserContext, chromium, Page } from 'playwright';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { setUp, tearDown } from '../src/playwright';
import type { Context } from '../src/playwright'

const RightBar = suite<Context>('RightBar', {
  page: {} as Page
})

RightBar.before(setUp)

RightBar.after(tearDown)

RightBar('activate React panel', async ctx => {
  const { page } = ctx
  await page.click('button[title="Svelte Panel"]')
  await page.click('button[title="Create React App"]')
  assert.ok(await page.isVisible('text=Learn React'))
})

RightBar('activate Svelte panel', async ctx => {
  const { page } = ctx
  await page.click('button[title="Svelte Panel"]')
  assert.ok(await page.isVisible('text=Visit the Svelte tutorial'))

  // Clicking the same button will close the panel
  await page.click('button[title="Svelte Panel"]')
  assert.ok(! await page.isVisible('text=Visit the Svelte tutorial'))

  // And again will open the panel
  await page.click('button[title="Svelte Panel"]')
  assert.ok(await page.isVisible('text=Visit the Svelte tutorial'))
})

RightBar.run();
