import { test, expect } from '../../fixtures/app.fixture';
import { STATIC_USERS, generateUser } from '../../utils/test-data';
import { uniqueEmail } from '../../utils/helpers';

test.describe('Login Functionality', () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.goto();
        await loginPage.expectPageLoaded();
    });

    test('@smoke should display login form correctly', async ({ loginPage }) => {
        await loginPage.expectPageLoaded();
        await loginPage.expectSubmitEnabled();
    });

    test('@smoke should login with valid credentials', async ({ page, loginPage }) => {
        await loginPage.login(
            STATIC_USERS.standard.email,
            STATIC_USERS.standard.password
        );
        await expect(page).toHaveURL(/\/dashboard/);
    });

    test('@critical should show error for invalid credentials', async ({ loginPage }) => {
        await loginPage.login('wrong@email.com', 'WrongPass123!');
        await loginPage.expectErrorContains('Invalid');
    });

    test('should show error for empty email', async ({ loginPage }) => {
        await loginPage.fillPassword('SomePass123!');
        await loginPage.clickSubmit();
        await loginPage.expectEmailValidationError(/required|enter.*email/i);
    });

    test('should show error for empty password', async ({ loginPage }) => {
        await loginPage.fillEmail('user@example.com');
        await loginPage.clickSubmit();
        await loginPage.expectPasswordValidationError(/required|enter.*password/i);
    });

    test('should show error for invalid email format', async ({ loginPage }) => {
        await loginPage.login('not-an-email', 'SomePass123!');
        await loginPage.expectEmailValidationError(/valid|invalid.*email/i);
    });

    test('should navigate to forgot password page', async ({ page, loginPage }) => {
        await loginPage.clickForgotPassword();
        await expect(page).toHaveURL(/\/forgot-password/);
    });

    test('should navigate to sign up page', async ({ page, loginPage }) => {
        await loginPage.clickSignUp();
        await expect(page).toHaveURL(/\/signup|\/register/);
    });

    test('should clear form fields', async ({ loginPage }) => {
        await loginPage.fillEmail('test@example.com');
        await loginPage.fillPassword('TestPass123!');
        await loginPage.clearForm();
        await expect(loginPage.emailInput).toHaveValue('');
        await expect(loginPage.passwordInput).toHaveValue('');
    });

    test('should persist email after failed login', async ({ loginPage }) => {
        const email = uniqueEmail('persist');
        await loginPage.login(email, 'WrongPass123!');
        await loginPage.expectErrorContains('Invalid');
        await expect(loginPage.emailInput).toHaveValue(email);
    });
});