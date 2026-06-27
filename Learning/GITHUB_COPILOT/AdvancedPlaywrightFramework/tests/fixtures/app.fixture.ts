import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { ProductsPage } from '../pages/products.page';
import { CheckoutPage } from '../pages/checkout.page';

/**
 * Custom fixtures -- extend the base test with Page Objects and authenticated state.
 *
 * Usage in tests:
 *   import { test, expect } from '../fixtures/app.fixture';
 *   test('my test', async ({ loginPage, dashboardPage }) => { ... });
 */

type AppFixtures = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    productsPage: ProductsPage;
    checkoutPage: CheckoutPage;
    authenticatedPage: Page;
};

export const test = base.extend<AppFixtures>({
    // Page Object fixtures -- created fresh per test
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },

    productsPage: async ({ page }, use) => {
        await use(new ProductsPage(page));
    },

    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },

    // Authenticated page -- uses stored auth state
    authenticatedPage: async ({ browser }, use) => {
        const context = await browser.newContext({
            storageState: 'playwright/.auth/user.json',
        });
        const page = await context.newPage();
        await use(page);
        await context.close();
    },
});

export { expect } from '@playwright/test';