import { Page, expect } from '@playwright/test';

/**
 * General test helper utilities.
 */

/** Wait for a specific network request to complete */
export async function waitForApiCall(
    page: Page,
    urlPattern: string | RegExp,
    method: string = 'GET',
    timeout: number = 10_000
) {
    const response = await page.waitForResponse(
        (resp) => resp.url().includes(urlPattern.toString()) && resp.request().method() === method,
        { timeout }
    );
    return response;
}

/** Mock an API endpoint with a custom response */
export async function mockApi(
    page: Page,
    urlPattern: string | RegExp,
    responseBody: object,
    status: number = 200
) {
    await page.route(urlPattern, async (route) => {
        await route.fulfill({
            status,
            contentType: 'application/json',
            body: JSON.stringify(responseBody),
        });
    });
}

/** Abort requests to specific domains (e.g., analytics, ads) */
export async function blockRequests(page: Page, domains: string[]) {
    await page.route('**/*', (route) => {
        const url = route.request().url();
        if (domains.some((domain) => url.includes(domain))) {
            route.abort();
        } else {
            route.continue();
        }
    });
}

/** Retry an assertion with exponential backoff */
export async function retryAssertion(
    fn: () => Promise<void>,
    maxRetries: number = 3,
    delayMs: number = 500
): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            await fn();
            return;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(2, i)));
        }
    }
}

/** Generate a unique email for test isolation */
export function uniqueEmail(prefix: string = 'test'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}@test.com`;
}

/** Generate a unique username */
export function uniqueUsername(prefix: string = 'user'): string {
    const timestamp = Date.now();
    return `${prefix}_${timestamp}`;
}

/** Format a price string to a number */
export function parsePrice(priceStr: string): number {
    return parseFloat(priceStr.replace(/[^0-9.]/g, ''));
}

/** Assert that a page has no console errors (excluding known false positives) */
export async function assertNoConsoleErrors(
    page: Page,
    ignorePatterns: (string | RegExp)[] = []
): Promise<void> {
    const errors: string[] = [];
    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            const text = msg.text();
            const shouldIgnore = ignorePatterns.some((pattern) =>
                typeof pattern === 'string' ? text.includes(pattern) : pattern.test(text)
            );
            if (!shouldIgnore) {
                errors.push(text);
            }
        }
    });
    // Wait a bit for any pending console errors
    await page.waitForTimeout(1000);
    expect(errors, `Console errors found:\n${errors.join('\n')}`).toHaveLength(0);
}

/** Scroll to the bottom of the page */
export async function scrollToBottom(page: Page): Promise<void> {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
}

/** Scroll to the top of the page */
export async function scrollToTop(page: Page): Promise<void> {
    await page.evaluate(() => window.scrollTo(0, 0));
}

/** Check if running in CI */
export function isCI(): boolean {
    return !!process.env.CI;
}

/** Get environment variable with fallback */
export function env(key: string, fallback: string = ''): string {
    return process.env[key] || fallback;
}