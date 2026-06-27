import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Login Page Object -- encapsulates all login page interactions.
 */
export class LoginPage extends BasePage {
    // --- Locators ---
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    readonly errorMessage: Locator;
    readonly forgotPasswordLink: Locator;
    readonly signUpLink: Locator;
    readonly rememberMeCheckbox: Locator;
    readonly heading: Locator;

    constructor(page: Page) {
        super(page);
        this.heading = page.getByRole('heading', { name: /sign in|login|log in/i });
        this.emailInput = page.getByLabel(/email/i);
        this.passwordInput = page.getByLabel(/password/i);
        this.submitButton = page.getByRole('button', { name: /sign in|login|log in|submit/i });
        this.errorMessage = page.getByRole('alert');
        this.forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });
        this.signUpLink = page.getByRole('link', { name: /sign up|register|create account/i });
        this.rememberMeCheckbox = page.getByLabel(/remember me/i);
    }

    /** Navigate to the login page */
    async goto(): Promise<void> {
        await this.navigate('/login');
        await this.waitForPageLoad();
    }

    /** Perform a full login action */
    async login(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }

    /** Login with remember-me checked */
    async loginWithRememberMe(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.rememberMeCheckbox.check();
        await this.submitButton.click();
    }

    /** Fill email field only */
    async fillEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
    }

    /** Fill password field only */
    async fillPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    /** Click submit button */
    async clickSubmit(): Promise<void> {
        await this.submitButton.click();
    }

    /** Assert error message is visible with specific text */
    async expectErrorMessage(message: string | RegExp): Promise<void> {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toHaveText(message);
    }

    /** Assert error message contains text */
    async expectErrorContains(text: string): Promise<void> {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toContainText(text);
    }

    /** Assert the login page is displayed */
    async expectPageLoaded(): Promise<void> {
        await expect(this.heading).toBeVisible();
        await expect(this.emailInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.submitButton).toBeVisible();
    }

    /** Assert email validation error */
    async expectEmailValidationError(message: string): Promise<void> {
        await expect(this.emailInput).toHaveAttribute('aria-invalid', 'true');
        const error = this.page.locator('#email-error, [data-testid="email-error"]');
        if (await error.isVisible()) {
            await expect(error).toHaveText(message);
        }
    }

    /** Assert password validation error */
    async expectPasswordValidationError(message: string): Promise<void> {
        await expect(this.passwordInput).toHaveAttribute('aria-invalid', 'true');
        const error = this.page.locator('#password-error, [data-testid="password-error"]');
        if (await error.isVisible()) {
            await expect(error).toHaveText(message);
        }
    }

    /** Assert submit button is disabled */
    async expectSubmitDisabled(): Promise<void> {
        await expect(this.submitButton).toBeDisabled();
    }

    /** Assert submit button is enabled */
    async expectSubmitEnabled(): Promise<void> {
        await expect(this.submitButton).toBeEnabled();
    }

    /** Click forgot password link */
    async clickForgotPassword(): Promise<void> {
        await this.forgotPasswordLink.click();
    }

    /** Click sign up link */
    async clickSignUp(): Promise<void> {
        await this.signUpLink.click();
    }

    /** Clear all form fields */
    async clearForm(): Promise<void> {
        await this.emailInput.clear();
        await this.passwordInput.clear();
    }
}