# Project 2: Selenium Automation Framework for Salesforce Login

Enterprise-grade Selenium + Java + Maven + TestNG automation framework for testing the **Salesforce login page** (`login.salesforce.com`).

## Architecture

```
AdvanceSeleniumFramework/
├── pom.xml                                    # Selenium 4.25, TestNG 7.10, WebDriverManager 5.9
├── testng.xml                                 # Suite: ValidLoginTest + InvalidLoginTest
├── src/test/java/
│   ├── config/
│   │   └── ConfigReader.java                 # External config.properties loader
│   ├── utils/
│   │   ├── DriverManager.java                # ThreadLocal ChromeDriver factory
│   │   └── WaitHelper.java                   # WebDriverWait wrapper (no Thread.sleep)
│   ├── base/
│   │   └── BaseTest.java                     # @BeforeSuite / @AfterSuite setup
│   ├── pages/
│   │   ├── LoginPage.java                    # Page Object 1 — XPath-only @FindBy
│   │   └── HomePage.java                     # Page Object 2 — Post-login dashboard
│   └── tests/
│       ├── ValidLoginTest.java               # Script 1: Valid credentials → asserts dashboard
│       └── InvalidLoginTest.java             # Script 2: Invalid credentials → asserts error
└── src/test/resources/
    └── config.properties                     # URL, credentials, timeouts
```

## Key Features

| Feature | Implementation |
|---------|---------------|
| **Page Object Model** | `PageFactory.initElements()` + `@FindBy` |
| **Locators** | XPath only — zero CSS, ID, name selectors |
| **Wait Strategy** | `WaitHelper` with `WebDriverWait` + `ExpectedConditions` — no `Thread.sleep()` |
| **Error Handling** | Try-catch in every POM action method |
| **Thread Safety** | `ThreadLocal<WebDriver>` in DriverManager |
| **Config** | External `config.properties` — no hardcoded values |
| **Reporting** | TestNG Surefire reports in `target/surefire-reports/` |

## Test Results

| Test Script | Status | Time |
|------------|--------|------|
| `InvalidLoginTest` | ✅ PASSED | 18.77s |
| `ValidLoginTest` | ⚠️ Needs real credentials | 34.32s |

## How to Run

### Prerequisites
- JDK 11+
- Maven 3.9+
- Chrome browser

### Setup
Update `src/test/resources/config.properties` with your Salesforce credentials:
```properties
valid.username=your_email@salesforce.com
valid.password=YourPassword123
```

### Run All Tests
```bash
cd AdvanceSeleniumFramework
mvn clean test
```

### Run Specific Test
```bash
mvn test -Dtest=ValidLoginTest
mvn test -Dtest=InvalidLoginTest
```

## Prompt Framework

The full prompt used to generate this framework is in `prompt.md` — built using the **RICE-POT** framework with anti-hallucination guardrails from `Anti_Hallucinations_Rules.md`.
