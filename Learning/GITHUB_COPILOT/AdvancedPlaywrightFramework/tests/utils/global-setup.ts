/**
 * Global setup -- runs once before all tests.
 * Use for seeding test data, setting up test infrastructure, etc.
 */
async function globalSetup(): Promise<void> {
    console.log('[Global Setup] Starting...');

    // Example: Seed test database
    // await seedTestDatabase();

    // Example: Verify required environment variables
    const requiredEnvVars = ['BASE_URL'];
    for (const varName of requiredEnvVars) {
        if (!process.env[varName]) {
            console.warn(`[Global Setup] Warning: ${varName} is not set. Using defaults.`);
        }
    }

    console.log('[Global Setup] Complete.');
}

export default globalSetup;