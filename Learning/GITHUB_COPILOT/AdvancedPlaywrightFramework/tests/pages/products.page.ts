import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Products Page Object -- encapsulates product listing interactions.
 */
export class ProductsPage extends BasePage {
    // --- Locators ---
    readonly heading: Locator;
    readonly productList: Locator;
    readonly productCards: Locator;
    readonly sortDropdown: Locator;
    readonly filterButton: Locator;
    readonly searchInput: Locator;
    readonly cartIcon: Locator;
    readonly cartCount: Locator;
    readonly pagination: Locator;
    readonly nextPageButton: Locator;
    readonly prevPageButton: Locator;

    constructor(page: Page) {
        super(page);
        this.heading = page.getByRole('heading', { name: /products|shop|catalog/i });
        this.productList = page.getByRole('list').filter({ has: page.getByRole('listitem') });
        this.productCards = page.getByTestId('product-card');
        this.sortDropdown = page.getByLabel(/sort/i);
        this.filterButton = page.getByRole('button', { name: /filter/i });
        this.searchInput = page.getByPlaceholder(/search products/i);
        this.cartIcon = page.getByRole('link', { name: /cart|basket/i });
        this.cartCount = page.getByTestId('cart-count');
        this.pagination = page.getByRole('navigation', { name: /pagination/i });
        this.nextPageButton = page.getByRole('link', { name: /next/i });
        this.prevPageButton = page.getByRole('link', { name: /previous/i });
    }

    /** Navigate to the products page */
    async goto(): Promise<void> {
        await this.navigate('/products');
        await this.waitForPageLoad();
    }

    /** Assert the products page is loaded */
    async expectPageLoaded(): Promise<void> {
        await expect(this.heading).toBeVisible();
        await expect(this.productCards.first()).toBeVisible();
    }

    /** Get the number of product cards displayed */
    async getProductCount(): Promise<number> {
        return this.productCards.count();
    }

    /** Assert a minimum number of products are displayed */
    async expectMinimumProducts(count: number): Promise<void> {
        const actual = await this.getProductCount();
        expect(actual).toBeGreaterThanOrEqual(count);
    }

    /** Click on a product by name */
    async clickProduct(name: string): Promise<void> {
        await this.productCards.filter({ hasText: name }).click();
        await this.waitForPageLoad();
    }

    /** Click on the nth product (0-indexed) */
    async clickNthProduct(index: number): Promise<void> {
        await this.productCards.nth(index).click();
        await this.waitForPageLoad();
    }

    /** Add a product to cart by name */
    async addToCart(productName: string): Promise<void> {
        const card = this.productCards.filter({ hasText: productName });
        await card.getByRole('button', { name: /add to cart/i }).click();
    }

    /** Add nth product to cart */
    async addNthToCart(index: number): Promise<void> {
        const card = this.productCards.nth(index);
        await card.getByRole('button', { name: /add to cart/i }).click();
    }

    /** Sort products by a given option */
    async sortBy(option: string): Promise<void> {
        await this.sortDropdown.selectOption(option);
        await this.waitForPageLoad();
    }

    /** Search for products */
    async search(query: string): Promise<void> {
        await this.searchInput.fill(query);
        await this.searchInput.press('Enter');
        await this.waitForPageLoad();
    }

    /** Get the cart item count */
    async getCartCount(): Promise<number> {
        const text = await this.cartCount.textContent();
        return text ? parseInt(text, 10) : 0;
    }

    /** Assert cart count */
    async expectCartCount(count: number): Promise<void> {
        await expect(this.cartCount).toHaveText(String(count));
    }

    /** Navigate to cart */
    async goToCart(): Promise<void> {
        await this.cartIcon.click();
        await this.waitForPageLoad();
    }

    /** Go to next page of products */
    async goToNextPage(): Promise<void> {
        await this.nextPageButton.click();
        await this.waitForPageLoad();
    }

    /** Go to previous page of products */
    async goToPrevPage(): Promise<void> {
        await this.prevPageButton.click();
        await this.waitForPageLoad();
    }

    /** Assert product exists on the page */
    async expectProductVisible(name: string): Promise<void> {
        await expect(this.productCards.filter({ hasText: name })).toBeVisible();
    }

    /** Assert no products match the search */
    async expectNoProducts(): Promise<void> {
        await expect(this.productCards).toHaveCount(0);
        await expect(this.page.getByText(/no products found/i)).toBeVisible();
    }
}