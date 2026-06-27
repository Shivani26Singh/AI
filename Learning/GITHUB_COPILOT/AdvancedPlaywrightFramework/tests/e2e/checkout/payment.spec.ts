import { test, expect } from '../../fixtures/app.fixture';
import { generateShippingInfo, generatePaymentInfo } from '../../utils/test-data';

test.describe('Payment Processing', () => {
    test.beforeEach(async ({ checkoutPage }) => {
        await checkoutPage.gotoCheckout();
        await checkoutPage.expectCheckoutLoaded();
    });

    test('@smoke should display checkout form', async ({ checkoutPage }) => {
        await checkoutPage.expectCheckoutLoaded();
        await expect(checkoutPage.firstNameInput).toBeVisible();
        await expect(checkoutPage.lastNameInput).toBeVisible();
        await expect(checkoutPage.emailInput).toBeVisible();
        await expect(checkoutPage.addressInput).toBeVisible();
        await expect(checkoutPage.cardNumberInput).toBeVisible();
    });

    test('should validate card number format', async ({ checkoutPage }) => {
        const shipping = generateShippingInfo();
        await checkoutPage.fillShippingInfo(shipping);

        // Fill invalid card
        await checkoutPage.fillPaymentInfo({
            cardNumber: '1234',
            expiry: '12/28',
            cvc: '12',
            cardName: 'Test User',
        });

        await checkoutPage.placeOrder();
        await checkoutPage.expectValidationError('cardNumber', /invalid|valid.*card/i);
    });

    test('should validate expiry date format', async ({ checkoutPage }) => {
        const shipping = generateShippingInfo();
        await checkoutPage.fillShippingInfo(shipping);

        await checkoutPage.fillPaymentInfo({
            cardNumber: '4111111111111111',
            expiry: '13/99',
            cvc: '123',
            cardName: 'Test User',
        });

        await checkoutPage.placeOrder();
        await checkoutPage.expectValidationError('expiry', /invalid|valid.*expir/i);
    });

    test('should validate CVC format', async ({ checkoutPage }) => {
        const shipping = generateShippingInfo();
        await checkoutPage.fillShippingInfo(shipping);

        await checkoutPage.fillPaymentInfo({
            cardNumber: '4111111111111111',
            expiry: '12/28',
            cvc: '1',
            cardName: 'Test User',
        });

        await checkoutPage.placeOrder();
        await checkoutPage.expectValidationError('cvc', /invalid|valid.*cvc|cvv/i);
    });

    test('@critical should process payment with valid card', async ({ checkoutPage }) => {
        const shipping = generateShippingInfo();
        await checkoutPage.fillShippingInfo(shipping);

        const payment = generatePaymentInfo();
        await checkoutPage.fillPaymentInfo(payment);

        await checkoutPage.placeOrder();
        await checkoutPage.expectOrderConfirmed();
    });

    test('should handle declined card', async ({ checkoutPage }) => {
        const shipping = generateShippingInfo();
        await checkoutPage.fillShippingInfo(shipping);

        // Use a card number that triggers decline
        await checkoutPage.fillPaymentInfo({
            cardNumber: '4000000000000002', // Common decline test card
            expiry: '12/28',
            cvc: '123',
            cardName: 'Test User',
        });

        await checkoutPage.placeOrder();
        await expect(
            checkoutPage.page.getByText(/declined|not authorized|payment failed/i)
        ).toBeVisible();
    });
});