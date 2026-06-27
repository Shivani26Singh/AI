import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    timeout: 60_000,
    expect: {
        timeout: 10_000,
    },
    reporter: [
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['json', { outputFile: 'test-results/results.json' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
        process.env.CI ? ['github'] : ['list'],
        ['line'],
    ],
    use: {
        baseURL: process.env.BASE_URL || 'https://demo.playwright.dev',
        trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        actionTimeout: 15_000,
        navigationTimeout: 30_000,
        testIdAttribute: 'data-testid',
    },
    projects: [
        // Auth setup -- runs once before all tests
        {
            name: 'setup',
            testMatch: /.*\.setup\.ts/,
        },
        // Desktop browsers
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1920, height: 1080 },
                storageState: 'playwright/.auth/user.json',
            },
            dependencies: ['setup'],
        },
        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
                viewport: { width: 1920, height: 1080 },
                storageState: 'playwright/.auth/user.json',
            },
            dependencies: ['setup'],
        },
        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari'],
                viewport: { width: 1920, height: 1080 },
                storageState: 'playwright/.auth/user.json',
            },
            dependencies: ['setup'],
        },
        // Mobile browsers
        {
            name: 'mobile-chrome',
            use: {
                ...devices['Pixel 7'],
                storageState: 'playwright/.auth/user.json',
            },
            dependencies: ['setup'],
        },
        {
            name: 'mobile-safari',
            use: {
                ...devices['iPhone 14'],
                storageState: 'playwright/.auth/user.json',
            },
            dependencies: ['setup'],
        },
        // Tablet
        {
            name: 'tablet',
            use: {
                ...devices['iPad Pro'],
                storageState: 'playwright/.auth/user.json',
            },
            dependencies: ['setup'],
        },
    ],
    webServer: process.env.WEB_SERVER_ENABLED === 'true'
        ? {
            command: process.env.WEB_SERVER_COMMAND || 'npm run dev',
            url: process.env.BASE_URL || 'http://localhost:3000',
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
        }
        : undefined,
    // Global setup and teardown
    globalSetup: require.resolve('./tests/utils/global-setup'),
    globalTeardown: require.resolve('./tests/utils/global-teardown'),
});