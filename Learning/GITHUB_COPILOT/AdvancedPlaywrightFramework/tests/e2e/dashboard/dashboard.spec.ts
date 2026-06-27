import { test, expect } from '../../fixtures/app.fixture';

test.describe('Dashboard Functionality', () => {
    test.beforeEach(async ({ dashboardPage }) => {
        await dashboardPage.goto();
        await dashboardPage.expectPageLoaded();
    });

    test('@smoke should display dashboard with welcome message', async ({ dashboardPage }) => {
        await dashboardPage.expectPageLoaded();
        await dashboardPage.expectDashboardUrl();
    });

    test('should display user name in welcome message', async ({ dashboardPage }) => {
        await dashboardPage.expectWelcomeMessageContains('Welcome');
    });

    test('should have working sidebar navigation', async ({ dashboardPage }) => {
        // Verify sidebar is visible
        await expect(dashboardPage.sidebar).toBeVisible();

        // Verify sidebar has links
        const linkCount = await dashboardPage.sidebarLinks.count();
        expect(linkCount).toBeGreaterThan(0);
    });

    test('should navigate to profile page', async ({ page, dashboardPage }) => {
        await dashboardPage.goToProfile();
        await expect(page).toHaveURL(/\/profile/);
    });

    test('should navigate to settings page', async ({ page, dashboardPage }) => {
        await dashboardPage.goToSettings();
        await expect(page).toHaveURL(/\/settings/);
    });

    test('should logout successfully', async ({ page, dashboardPage }) => {
        await dashboardPage.logout();
        await expect(page).toHaveURL(/\/login/);
    });

    test('should display notification bell', async ({ dashboardPage }) => {
        await expect(dashboardPage.notificationBell).toBeVisible();
    });

    test('should have a functional search input', async ({ dashboardPage }) => {
        await expect(dashboardPage.searchInput).toBeVisible();
        await expect(dashboardPage.searchInput).toBeEnabled();
    });
});