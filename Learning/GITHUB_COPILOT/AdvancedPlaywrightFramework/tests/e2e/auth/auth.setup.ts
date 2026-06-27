import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

/**
 * Auth setup -- runs once before all tests to establish authentication state.
 * The stored state is reused across all test projects.
 */
setup('authenticate', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.expectPageLoaded();

    const email = process.env.TEST_USER_EMAIL || 'testuser@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'TestPass123!';

    await loginPage.login(email, password);

    // Verify successful login by checking we're on the dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });

    // Save the authentication state
    await page.context().storageState({ path: 'playwright/.auth/user.json' });
});