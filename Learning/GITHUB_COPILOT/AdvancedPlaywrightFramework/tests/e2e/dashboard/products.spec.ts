import { test, expect } from '../../fixtures/app.fixture';
import { STATIC_PRODUCTS } from '../../utils/test-data';

test.describe('Products Page', () => {
    test.beforeEach(async ({ productsPage }) => {
        await productsPage.goto();
        await productsPage.expectPageLoaded();
    });

    test('@smoke should display product listing', async ({ productsPage }) => {
        await productsPage.expectPageLoaded();
        await productsPage.expectMinimumProducts(1);
    });

    test('should display multiple products', async ({ productsPage }) => {
        const count = await productsPage.getProductCount();
        expect(count).toBeGreaterThan(0);
    });

    test('should navigate to product detail', async ({ page, productsPage }) => {
        await productsPage.clickNthProduct(0);
        await expect(page).toHaveURL(/\/products\/\d+/);
    });

    test('should add product to cart', async ({ productsPage }) => {
        await productsPage.addNthToCart(0);
        await productsPage.expectCartCount(1);
    });

    test('should add multiple products to cart', async ({ productsPage }) => {
        await productsPage.addNthToCart(0);
        await productsPage.addNthToCart(1);
        await productsPage.expectCartCount(2);
    });

    test('should sort products', async ({ productsPage }) => {
        await productsPage.sortBy('price-asc');
        await productsPage.expectPageLoaded();
        // Verify products are still displayed after sorting
        await productsPage.expectMinimumProducts(1);
    });

    test('should search for products', async ({ productsPage }) => {
        await productsPage.search('test');
        // May or may not find results, but page should still be functional
        await productsPage.expectPageLoaded();
    });

    test('should navigate to cart from products page', async ({ page, productsPage }) => {
        await productsPage.goToCart();
        await expect(page).toHaveURL(/\/cart/);
    });

    test('should paginate through products', async ({ productsPage }) => {
        const firstPageCount = await productsPage.getProductCount();

        // Try going to next page if pagination exists
        const hasNextPage = await productsPage.nextPageButton.isVisible().catch(() => false);
        if (hasNextPage) {
            await productsPage.goToNextPage();
            await productsPage.expectMinimumProducts(1);
        }
    });
});