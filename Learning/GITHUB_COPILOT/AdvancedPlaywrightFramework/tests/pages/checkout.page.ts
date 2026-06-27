import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Checkout Page Object -- encapsulates cart and checkout interactions.
 */
export class CheckoutPage extends BasePage {
    // --- Cart Locators ---
    readonly cartHeading: Locator;
    readonly cartItems: Locator;
    readonly cartItemCount: Locator;
    readonly cartTotal: Locator;
    readonly removeItemButton: Locator;
    readonly quantityInput: Locator;
    readonly emptyCartMessage: Locator;
    readonly continueShoppingButton: Locator;
    readonly proceedToCheckoutButton: Locator;

    // --- Checkout Form Locators ---
    readonly checkoutHeading: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly addressInput: Locator;
    readonly cityInput: Locator;
    readonly stateDropdown: Locator;
    readonly zipInput: Locator;
    readonly countryDropdown: Locator;
    readonly phoneInput: Locator;
    readonly sameAsBillingCheckbox: Locator;
    readonly placeOrderButton: Locator;

    // --- Payment Locators ---
    readonly cardNumberInput: Locator;
    readonly expiryInput: Locator;
    readonly cvcInput: Locator;
    readonly cardNameInput: Locator;

    // --- Confirmation Locators ---
    readonly orderConfirmation: Locator;
    readonly orderNumber: Locator;
    readonly orderTotal: Locator;

    constructor(page: Page) {
        super(page);

        // Cart
        this.cartHeading = page.getByRole('heading', { name: /cart|shopping cart|basket/i });
        this.cartItems = page.getByTestId('cart-item');
        this.cartItemCount = page.getByTestId('cart-item-count');
        this.cartTotal = page.getByTestId('cart-total');
        this.removeItemButton = page.getByRole('button', { name: /remove/i });
        this.quantityInput = page.getByLabel(/quantity/i);
        this.emptyCartMessage = page.getByText(/your cart is empty|no items/i);
        this.continueShoppingButton = page.getByRole('link', { name: /continue shopping/i });
        this.proceedToCheckoutButton = page.getByRole('button', { name: /proceed to checkout|checkout/i });

        // Checkout form
        this.checkoutHeading = page.getByRole('heading', { name: /checkout/i });
        this.firstNameInput = page.getByLabel(/first name/i);
        this.lastNameInput = page.getByLabel(/last name/i);
        this.emailInput = page.getByLabel(/email/i);
        this.addressInput = page.getByLabel(/address/i);
        this.cityInput = page.getByLabel(/city/i);
        this.stateDropdown = page.getByLabel(/state/i);
        this.zipInput = page.getByLabel(/zip|postal code/i);
        this.countryDropdown = page.getByLabel(/country/i);
        this.phoneInput = page.getByLabel(/phone/i);
        this.sameAsBillingCheckbox = page.getByLabel(/same as billing/i);
        this.placeOrderButton = page.getByRole('button', { name: /place order|submit order/i });

        // Payment
        this.cardNumberInput = page.getByLabel(/card number/i);
        this.expiryInput = page.getByLabel(/expir/i);
        this.cvcInput = page.getByLabel(/cvc|cvv|security code/i);
        this.cardNameInput = page.getByLabel(/name on card/i);

        // Confirmation
        this.orderConfirmation = page.getByText(/order confirmed|thank you|order placed/i);
        this.orderNumber = page.getByTestId('order-number');
        this.orderTotal = page.getByTestId('order-total');
    }

    // --- Cart Methods ---

    /** Navigate to the cart page */
    async gotoCart(): Promise<void> {
        await this.navigate('/cart');
        await this.waitForPageLoad();
    }

    /** Assert cart page is loaded */
    async expectCartLoaded(): Promise<void> {
        await expect(this.cartHeading).toBeVisible();
    }

    /** Get the number of items in the cart */
    async getCartItemCount(): Promise<number> {
        return this.cartItems.count();
    }

    /** Assert cart has a specific number of items */
    async expectCartItemCount(count: number): Promise<void> {
        await expect(this.cartItems).toHaveCount(count);
    }

    /** Assert cart is empty */
    async expectCartEmpty(): Promise<void> {
        await expect(this.emptyCartMessage).toBeVisible();
    }

    /** Remove an item from the cart by name */
    async removeItem(itemName: string): Promise<void> {
        const item = this.cartItems.filter({ hasText: itemName });
        await item.getByRole('button', { name: /remove/i }).click();
    }

    /** Update quantity for an item */
    async updateQuantity(itemName: string, quantity: number): Promise<void> {
        const item = this.cartItems.filter({ hasText: itemName });
        await item.getByLabel(/quantity/i).fill(String(quantity));
    }

    /** Get the cart total as a string */
    async getCartTotal(): Promise<string> {
        return (await this.cartTotal.textContent()) || '';
    }

    /** Proceed to checkout */
    async proceedToCheckout(): Promise<void> {
        await this.proceedToCheckoutButton.click();
        await this.waitForPageLoad();
    }

    /** Continue shopping */
    async continueShopping(): Promise<void> {
        await this.continueShoppingButton.click();
        await this.waitForPageLoad();
    }

    // --- Checkout Methods ---

    /** Navigate to checkout page */
    async gotoCheckout(): Promise<void> {
        await this.navigate('/checkout');
        await this.waitForPageLoad();
    }

    /** Assert checkout page is loaded */
    async expectCheckoutLoaded(): Promise<void> {
        await expect(this.checkoutHeading).toBeVisible();
    }

    /** Fill the shipping/billing form */
    async fillShippingInfo(shippingInfo: {
        firstName: string;
        lastName: string;
        email: string;
        address: string;
        city: string;
        state: string;
        zip: string;
        country?: string;
        phone?: string;
    }): Promise<void> {
        await this.firstNameInput.fill(shippingInfo.firstName);
        await this.lastNameInput.fill(shippingInfo.lastName);
        await this.emailInput.fill(shippingInfo.email);
        await this.addressInput.fill(shippingInfo.address);
        await this.cityInput.fill(shippingInfo.city);
        await this.stateDropdown.selectOption(shippingInfo.state);
        await this.zipInput.fill(shippingInfo.zip);
        if (shippingInfo.country) {
            await this.countryDropdown.selectOption(shippingInfo.country);
        }
        if (shippingInfo.phone) {
            await this.phoneInput.fill(shippingInfo.phone);
        }
    }

    /** Fill payment information */
    async fillPaymentInfo(paymentInfo: {
        cardNumber: string;
        expiry: string;
        cvc: string;
        cardName: string;
    }): Promise<void> {
        await this.cardNumberInput.fill(paymentInfo.cardNumber);
        await this.expiryInput.fill(paymentInfo.expiry);
        await this.cvcInput.fill(paymentInfo.cvc);
        await this.cardNameInput.fill(paymentInfo.cardName);
    }

    /** Place the order */
    async placeOrder(): Promise<void> {
        await this.placeOrderButton.click();
        await this.waitForPageLoad();
    }

    /** Assert order confirmation is displayed */
    async expectOrderConfirmed(): Promise<void> {
        await expect(this.orderConfirmation).toBeVisible();
    }

    /** Get the order number */
    async getOrderNumber(): Promise<string> {
        return (await this.orderNumber.textContent()) || '';
    }

    /** Assert form validation error */
    async expectValidationError(field: string, message: string): Promise<void> {
        const errorLocator = this.page.locator(`[data-testid="${field}-error"]`);
        await expect(errorLocator).toBeVisible();
        await expect(errorLocator).toHaveText(message);
    }

    /** Assert place order button is disabled */
    async expectPlaceOrderDisabled(): Promise<void> {
        await expect(this.placeOrderButton).toBeDisabled();
    }

    /** Assert place order button is enabled */
    async expectPlaceOrderEnabled(): Promise<void> {
        await expect(this.placeOrderButton).toBeEnabled();
    }
}