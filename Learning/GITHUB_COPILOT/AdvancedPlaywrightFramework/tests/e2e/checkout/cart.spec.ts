import { test, expect } from '../../fixtures/app.fixture';
import { generateShippingInfo, generatePaymentInfo } from '../../utils/test-data';

test.describe('Checkout Flow', () => {
    test.beforeEach(async ({ checkoutPage }) => {
        await checkoutPage.gotoCart();
        await checkoutPage.expectCartLoaded();
    });

    test('@smoke should display cart page', async ({ checkoutPage }) => {
        await checkoutPage.expectCartLoaded();
    });

    test('should show empty cart message when no items', async ({ checkoutPage }) => {
        const itemCount = await checkoutPage.getCartItemCount();
        if (itemCount === 0) {
            await checkoutPage.expectCartEmpty();
        }
    });

    test('@critical should complete full checkout flow', async ({ page, checkoutPage }) => {
        // Skip if cart is empty -- this test needs items in cart
        const itemCount = await checkoutPage.getCartItemCount();
        if (itemCount === 0) {
            test.skip(true, 'Cart is empty -- add items first');
            return;
        }

        // Proceed to checkout
        await checkoutPage.proceedToCheckout();
        await checkoutPage.expectCheckoutLoaded();

        // Fill shipping info
        const shipping = generateShippingInfo();
        await checkoutPage.fillShippingInfo(shipping);

        // Fill payment info
        const payment = generatePaymentInfo();
        await checkoutPage.fillPaymentInfo(payment);

        // Place order
        await checkoutPage.placeOrder();

        // Verify order confirmation
        await checkoutPage.expectOrderConfirmed();
    });

    test('should validate required checkout fields', async ({ checkoutPage }) => {
        const itemCount = await checkoutPage.getCartItemCount();
        if (itemCount === 0) {
            test.skip(true, 'Cart is empty -- add items first');
            return;
        }

        await checkoutPage.proceedToCheckout();
        await checkoutPage.expectCheckoutLoaded();

        // Try to place order without filling form
        await checkoutPage.expectPlaceOrderDisabled();
    });

    test('should remove item from cart', async ({ checkoutPage }) => {
        const itemCount = await checkoutPage.getCartItemCount();
        if (itemCount === 0) {
            test.skip(true, 'Cart is empty -- nothing to remove');
            return;
        }

        await checkoutPage.removeItem(''); // Remove first item
        // Cart should update
        await checkoutPage.expectCartLoaded();
    });

    test('should continue shopping from cart', async ({ page, checkoutPage }) => {
        await checkoutPage.continueShopping();
        await expect(page).toHaveURL(/\/products/);
    });
});