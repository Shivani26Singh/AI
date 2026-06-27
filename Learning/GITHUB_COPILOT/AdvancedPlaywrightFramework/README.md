# Advanced Playwright E2E Framework

A production-ready Playwright end-to-end testing framework built with **Page Object Model**, **custom fixtures**, and **industry best practices**.

## 🏗️ Architecture

```
AdvancedPlaywrightFramework/
├── tests/
│   ├── e2e/                    # Test specs organized by feature
│   │   ├── auth/               # Login, signup, auth flows
│   │   ├── dashboard/          # Dashboard, products
│   │   └── checkout/           # Cart, payment, checkout
│   ├── fixtures/               # Custom test fixtures
│   │   └── app.fixture.ts      # Page Object + auth fixtures
│   ├── pages/                  # Page Object Model classes
│   │   ├── base.page.ts        # Abstract base page
│   │   ├── login.page.ts       # Login page
│   │   ├── dashboard.page.ts   # Dashboard page
│   │   ├── products.page.ts    # Products listing
│   │   ├── checkout.page.ts    # Cart + checkout
│   │   └── index.ts            # Barrel export
│   └── utils/                  # Helpers & test data
│       ├── test-data.ts        # Faker generators + static data
│       ├── helpers.ts          # Utility functions
│       ├── global-setup.ts     # Pre-test setup
│       └── global-teardown.ts  # Post-test cleanup
├── playwright/
│   └── .auth/                  # Stored auth state
├── test-data/                  # Static test files (PDFs, images)
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json               # TypeScript config
├── .env                        # Environment variables
└── package.json
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run tests with Playwright UI
npm run test:ui

# Run specific browser
npm run test:chrome
npm run test:firefox
npm run test:webkit

# Run smoke tests only
npm run test:smoke

# Run critical tests only
npm run test:critical

# View HTML report
npm run report

# View trace
npm run trace
```

## 📋 Test Tags

| Tag | Description |
|-----|-------------|
| `@smoke` | Core smoke tests |
| `@critical` | Business-critical paths |
| `@slow` | Slow-running tests |

Run tagged tests:
```bash
npx playwright test --grep @smoke
npx playwright test --grep "@smoke|@critical"
```

## 🔧 Configuration

Copy `.env.example` to `.env` and configure:

```env
BASE_URL=https://your-app.com
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=yourpassword
```

## 📐 Page Object Model

All page classes extend `BasePage` and follow these conventions:

- **Locators** declared as readonly properties at the top
- **Actions** are methods that perform user interactions
- **Assertions** are methods prefixed with `expect`
- **Selectors** use Playwright's semantic locators (`getByRole`, `getByLabel`, `getByTestId`)

```typescript
import { test, expect } from '../fixtures/app.fixture';

test('login flow', async ({ loginPage, dashboardPage }) => {
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  await dashboardPage.expectPageLoaded();
});
```

## 🧪 Writing Tests

### Using Fixtures

```typescript
import { test, expect } from '../fixtures/app.fixture';

test('my test', async ({ loginPage, dashboardPage, productsPage }) => {
  // Page objects are auto-injected
  await loginPage.goto();
  // ...
});
```

### Using Test Data

```typescript
import { generateUser, generateShippingInfo } from '../utils/test-data';

test('register', async ({ page }) => {
  const user = generateUser();
  // user.firstName, user.email, etc.
});
```

## 🌐 Cross-Browser Testing

The framework runs tests across 6 browser projects:

| Project | Device |
|---------|--------|
| `chromium` | Desktop Chrome (1920×1080) |
| `firefox` | Desktop Firefox (1920×1080) |
| `webkit` | Desktop Safari (1920×1080) |
| `mobile-chrome` | Pixel 7 |
| `mobile-safari` | iPhone 14 |
| `tablet` | iPad Pro |

## 📊 Reports

- **HTML Report**: `playwright-report/index.html`
- **JSON Results**: `test-results/results.json`
- **JUnit XML**: `test-results/junit.xml` (CI integration)

## 🔍 Debugging

```bash
# Debug mode (step through tests)
npm run test:debug

# UI mode (visual debugger)
npm run test:ui

# View trace of failed test
npm run trace

# Generate test code by recording
npm run codegen
```

## 🏷️ Best Practices

1. **User-centric** -- Tests mirror real user journeys
2. **Resilient selectors** -- `getByRole` > `getByLabel` > `getByTestId` > CSS
3. **Auto-waiting** -- No `waitForTimeout`, leverage Playwright's built-in waits
4. **Test isolation** -- Each test is independent
5. **Readable** -- Tests serve as documentation
6. **Tagged** -- Use `@smoke`, `@critical` for selective execution
7. **Parallel** -- `fullyParallel: true` for speed

## 📦 CI Integration

```yaml
# GitHub Actions example
- name: Run Playwright tests
  run: npx playwright test
  env:
    CI: true
    BASE_URL: ${{ secrets.BASE_URL }}
```

## 📄 License

MIT