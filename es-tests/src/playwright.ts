import { Browser, BrowserContext, chromium, Page } from 'playwright';

export interface Context {
    browser?: Browser
    context?: BrowserContext
    page: Page
}

export async function setUp(ctx: Context) {
    try {
        console.log(ctx)
        const browser = await chromium.launch({
            // headless: false,
            // slowMo: 1000,
        })
        const context = await browser.newContext()

        const page = await context.newPage();
        await page.goto('http://localhost:8081/')

        ctx.browser = browser
        ctx.context = context
        ctx.page = page
    } catch (err) {
        console.log('SETUP ERROR', err.message)
    }
}

export async function tearDown(ctx: Context) {
    const { context, browser } = ctx
    await context?.close()
    await browser?.close();
}
