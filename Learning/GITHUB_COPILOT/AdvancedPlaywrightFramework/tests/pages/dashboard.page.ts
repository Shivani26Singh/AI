import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Dashboard Page Object -- encapsulates dashboard interactions.
 */
export class DashboardPage extends BasePage {
    // --- Locators ---
    readonly heading: Locator;
    readonly welcomeMessage: Locator;
    readonly userMenu: Locator;
    readonly logoutButton: Locator;
    readonly sidebar: Locator;
    readonly sidebarLinks: Locator;
    readonly notificationBell: Locator;
    readonly notificationCount: Locator;
    readonly searchInput: Locator;
    readonly profileLink: Locator;
    readonly settingsLink: Locator;

    constructor(page: Page) {
        super(page);
        this.heading = page.getByRole('heading', { name: /dashboard|welcome/i });
        this.welcomeMessage = page.getByText(/welcome|hello/i);
        this.userMenu = page.getByRole('button', { name: /user menu|account|profile/i });
        this.logoutButton = page.getByRole('menuitem', { name: /sign out|log out|logout/i });
        this.sidebar = page.getByRole('navigation');
        this.sidebarLinks = page.getByRole('navigation').getByRole('link');
        this.notificationBell = page.getByRole('button', { name: /notifications/i });
        this.notificationCount = page.getByTestId('notification-count');
        this.searchInput = page.getByPlaceholder(/search/i);
        this.profileLink = page.getByRole('link', { name: /profile/i });
        this.settingsLink = page.getByRole('link', { name: /settings/i });
    }

    /** Navigate to the dashboard */
    async goto(): Promise<void> {
        await this.navigate('/dashboard');
        await this.waitForPageLoad();
    }

    /** Assert the dashboard page is loaded */
    async expectPageLoaded(): Promise<void> {
        await expect(this.heading).toBeVisible();
        await expect(this.welcomeMessage).toBeVisible();
    }

    /** Assert the URL is the dashboard */
    async expectDashboardUrl(): Promise<void> {
        await expect(this.page).toHaveURL(/\/dashboard/);
    }

    /** Logout via the user menu */
    async logout(): Promise<void> {
        await this.userMenu.click();
        await this.logoutButton.click();
    }

    /** Get the welcome message text */
    async getWelcomeMessage(): Promise<string> {
        return (await this.welcomeMessage.textContent()) || '';
    }

    /** Assert welcome message contains user's name */
    async expectWelcomeMessageContains(name: string): Promise<void> {
        await expect(this.welcomeMessage).toContainText(name);
    }

    /** Navigate to a sidebar link by name */
    async navigateToSidebarItem(name: string): Promise<void> {
        await this.sidebar.getByRole('link', { name }).click();
        await this.waitForPageLoad();
    }

    /** Get the notification count */
    async getNotificationCount(): Promise<number> {
        const text = await this.notificationCount.textContent();
        return text ? parseInt(text, 10) : 0;
    }

    /** Click notification bell */
    async openNotifications(): Promise<void> {
        await this.notificationBell.click();
    }

    /** Search for something */
    async search(query: string): Promise<void> {
        await this.searchInput.fill(query);
        await this.searchInput.press('Enter');
        await this.waitForPageLoad();
    }

    /** Navigate to profile */
    async goToProfile(): Promise<void> {
        await this.profileLink.click();
        await this.waitForPageLoad();
    }

    /** Navigate to settings */
    async goToSettings(): Promise<void> {
        await this.settingsLink.click();
        await this.waitForPageLoad();
    }
}