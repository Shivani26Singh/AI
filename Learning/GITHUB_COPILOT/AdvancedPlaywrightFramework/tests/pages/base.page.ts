import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object -- all page classes extend this.
 * Encapsulates common page interactions and utilities.
 */
export abstract class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /** Navigate to a relative path using the configured baseURL */
    async navigate(path: string): Promise<void> {
        await this.page.goto(path);
    }

    /** Wait for the page to fully load (network idle) */
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    /** Wait for the DOM content to be loaded */
    async waitForDomLoad(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
    }

    /** Get the current page title */
    async getTitle(): Promise<string> {
        return this.page.title();
    }

    /** Get the current URL */
    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    /** Take a full-page screenshot */
    async takeScreenshot(name: string): Promise<Buffer> {
        return this.page.screenshot({
            path: `screenshots/${name}.png`,
            fullPage: true,
        });
    }

    /** Take a viewport screenshot */
    async takeViewportScreenshot(name: string): Promise<Buffer> {
        return this.page.screenshot({
            path: `screenshots/${name}.png`,
            fullPage: false,
        });
    }

    /** Scroll an element into view */
    async scrollIntoView(locator: Locator): Promise<void> {
        await locator.scrollIntoViewIfNeeded();
    }

    /** Click with retry logic for flaky elements */
    async clickWithRetry(locator: Locator, retries = 3): Promise<void> {
        for (let i = 0; i < retries; i++) {
            try {
                await locator.click({ timeout: 5000 });
                return;
            } catch {
                if (i === retries - 1) throw new Error(`Failed to click after ${retries} retries`);
                await this.page.waitForTimeout(500);
            }
        }
    }

    /** Check if an element is present in the DOM (not necessarily visible) */
    async isElementPresent(locator: Locator): Promise<boolean> {
        return (await locator.count()) > 0;
    }

    /** Reload the current page */
    async reload(): Promise<void> {
        await this.page.reload();
        await this.waitForPageLoad();
    }

    /** Go back in browser history */
    async goBack(): Promise<void> {
        await this.page.goBack();
        await this.waitForPageLoad();
    }

    /** Go forward in browser history */
    async goForward(): Promise<void> {
        await this.page.goForward();
        await this.waitForPageLoad();
    }
}