import { test, expect } from '../../fixtures/app.fixture';
import { generateUser } from '../../utils/test-data';
import { uniqueEmail } from '../../utils/helpers';

test.describe('Signup Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/signup');
        await page.waitForLoadState('networkidle');
    });

    test('@smoke should display signup form correctly', async ({ page }) => {
        await expect(page.getByRole('heading', { name: /sign up|register|create account/i })).toBeVisible();
        await expect(page.getByLabel(/first name/i)).toBeVisible();
        await expect(page.getByLabel(/last name/i)).toBeVisible();
        await expect(page.getByLabel(/email/i)).toBeVisible();
        await expect(page.getByLabel(/password/i)).toBeVisible();
        await expect(page.getByRole('button', { name: /sign up|register|create account/i })).toBeVisible();
    });

    test('should register a new user successfully', async ({ page }) => {
        const user = generateUser();

        await page.getByLabel(/first name/i).fill(user.firstName);
        await page.getByLabel(/last name/i).fill(user.lastName);
        await page.getByLabel(/email/i).fill(user.email);
        await page.getByLabel(/password/i).fill(user.password);
        await page.getByRole('button', { name: /sign up|register|create account/i }).click();

        // Should redirect to dashboard or show success
        await expect(page).toHaveURL(/\/(dashboard|welcome|success)/, { timeout: 15_000 });
    });

    test('should show validation for empty required fields', async ({ page }) => {
        await page.getByRole('button', { name: /sign up|register|create account/i }).click();

        // Check for validation messages
        const errors = page.locator('[role="alert"], .error, .invalid-feedback');
        await expect(errors.first()).toBeVisible();
    });

    test('should show error for already registered email', async ({ page }) => {
        const existingUser = {
            firstName: 'Existing',
            lastName: 'User',
            email: 'existing@example.com',
            password: 'ExistingPass123!',
        };

        await page.getByLabel(/first name/i).fill(existingUser.firstName);
        await page.getByLabel(/last name/i).fill(existingUser.lastName);
        await page.getByLabel(/email/i).fill(existingUser.email);
        await page.getByLabel(/password/i).fill(existingUser.password);
        await page.getByRole('button', { name: /sign up|register|create account/i }).click();

        await expect(page.getByText(/already exists|already registered/i)).toBeVisible();
    });

    test('should enforce password strength requirements', async ({ page }) => {
        const user = generateUser();

        await page.getByLabel(/first name/i).fill(user.firstName);
        await page.getByLabel(/last name/i).fill(user.lastName);
        await page.getByLabel(/email/i).fill(user.email);
        await page.getByLabel(/password/i).fill('weak');
        await page.getByRole('button', { name: /sign up|register|create account/i }).click();

        await expect(page.getByText(/password.*(?:strong|length|character|minimum)/i)).toBeVisible();
    });

    test('should navigate to login page from signup', async ({ page }) => {
        await page.getByRole('link', { name: /sign in|login|log in/i }).click();
        await expect(page).toHaveURL(/\/login/);
    });
});