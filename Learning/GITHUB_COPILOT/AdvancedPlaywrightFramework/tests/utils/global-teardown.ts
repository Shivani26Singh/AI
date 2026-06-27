/**
 * Global teardown -- runs once after all tests.
 * Use for cleaning up test data, closing connections, etc.
 */
async function globalTeardown(): Promise<void> {
    console.log('[Global Teardown] Starting...');

    // Example: Clean up test database
    // await cleanupTestDatabase();

    console.log('[Global Teardown] Complete.');
}

export default globalTeardown;