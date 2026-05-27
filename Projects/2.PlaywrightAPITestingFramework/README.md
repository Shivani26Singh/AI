# Restful Booker API Test Framework

Playwright API automation framework for the [Restful Booker](https://restful-booker.herokuapp.com) API.

## Architecture

```
project-root
│
├── config/
│   ├── environments/       # Environment-specific .env files
│   │   ├── .env.default
│   │   ├── .env.staging
│   │   └── .env.production
│   └── config.js           # Centralized configuration loader
│
├── clients/
│   ├── base/
│   │   └── apiClient.js    # Base client: GET, POST, PUT, PATCH, DELETE
│   ├── auth/
│   │   └── authClient.js   # Auth resource client
│   ├── booking/
│   │   └── bookingClient.js # Booking resource client
│   └── ping/
│       └── pingClient.js   # Health check client
│
├── fixtures/
│   └── api.fixture.js      # Reusable fixture: client setup + auth
│
├── data/
│   └── testData.js         # Test data: payloads, credentials, queries
│
├── utils/
│   ├── env.js              # Environment helper
│   ├── logger.js           # Structured JSON logger
│   ├── assertions.js       # Reusable assertion helpers
│   └── helpers.js          # Test data generators
│
├── tests/
│   ├── smoke/              # Service availability + core endpoints
│   │   ├── health.spec.js
│   │   ├── auth.spec.js
│   │   └── booking.spec.js
│   ├── regression/         # Full CRUD, validation, error handling
│   │   ├── auth.spec.js
│   │   ├── booking-crud.spec.js
│   │   ├── booking-validation.spec.js
│   │   ├── response-headers.spec.js
│   │   ├── response-time.spec.js
│   │   └── negative-scenarios.spec.js
│   └── integration/        # Cross-resource workflows
│       ├── booking-lifecycle.spec.js
│       └── auth-booking-flow.spec.js
│
├── reports/                # Test reports output
├── .github/workflows/      # CI/CD: GitHub Actions
├── playwright.config.js
├── package.json
└── README.md
```

## Setup

```bash
npm install
npx playwright install
```

## Configuration

Environment variables are loaded from `config/environments/.env.{TEST_ENV}`.

| Variable | Description | Default |
|----------|-------------|---------|
| `TEST_ENV` | Environment to load | `default` |
| `BASE_URL` | API base URL | `https://restful-booker.herokuapp.com` |
| `AUTH_USERNAME` | Auth username | `admin` |
| `AUTH_PASSWORD` | Auth password | `password123` |

```bash
# Run with staging environment
TEST_ENV=staging npm test
```

## Running Tests

```bash
npm test                      # All tests
npm run test:smoke            # Smoke tests only
npm run test:regression       # Regression tests only
npm run test:integration      # Integration tests only
```

## Reports

**HTML Report:**
```bash
npm run report
```

**Allure Report:**
```bash
npm run report:allure:generate
npm run report:allure:open
```

## CI/CD

GitHub Actions workflow at `.github/workflows/api-tests.yml`:

- Runs on push/PR to main/master
- Scheduled daily at 06:00 UTC
- Manual trigger via `workflow_dispatch`
- Sequential: Smoke → Regression → Integration
- Artifacts: HTML + Allure reports

Required secrets in GitHub:
- `AUTH_USERNAME`
- `AUTH_PASSWORD`

Required variables in GitHub:
- `BASE_URL`

---

## Coverage Mapping

### Authentication

| Endpoint | Method | Client Method | Test File |
|----------|--------|---------------|-----------|
| `POST /auth` | POST | `AuthClient.createToken()` | `tests/smoke/auth.spec.js` |
| `POST /auth` | POST | `AuthClient.createToken()` | `tests/regression/auth.spec.js` |

### Booking

| Endpoint | Method | Client Method | Test File |
|----------|--------|---------------|-----------|
| `GET /booking` | GET | `BookingClient.getBookingIds()` | `tests/smoke/booking.spec.js` |
| `GET /booking` | GET | `BookingClient.getBookingIds()` | `tests/regression/booking-crud.spec.js` |
| `GET /booking?firstname=` | GET | `BookingClient.getBookingIds()` | `tests/regression/booking-crud.spec.js` |
| `GET /booking?lastname=` | GET | `BookingClient.getBookingIds()` | `tests/regression/booking-crud.spec.js` |
| `GET /booking/{id}` | GET | `BookingClient.getBooking()` | `tests/regression/booking-crud.spec.js` |
| `GET /booking/{id}` | GET | `BookingClient.getBooking()` | `tests/regression/negative-scenarios.spec.js` |
| `POST /booking` | POST | `BookingClient.createBooking()` | `tests/smoke/booking.spec.js` |
| `POST /booking` | POST | `BookingClient.createBooking()` | `tests/regression/booking-crud.spec.js` |
| `POST /booking` | POST | `BookingClient.createBooking()` | `tests/regression/booking-validation.spec.js` |
| `PUT /booking/{id}` | PUT | `BookingClient.updateBooking()` | `tests/regression/booking-crud.spec.js` |
| `PUT /booking/{id}` | PUT | `BookingClient.updateBooking()` | `tests/regression/negative-scenarios.spec.js` |
| `PATCH /booking/{id}` | PATCH | `BookingClient.partialUpdateBooking()` | `tests/regression/booking-crud.spec.js` |
| `PATCH /booking/{id}` | PATCH | `BookingClient.partialUpdateBooking()` | `tests/regression/negative-scenarios.spec.js` |
| `DELETE /booking/{id}` | DELETE | `BookingClient.deleteBooking()` | `tests/regression/booking-crud.spec.js` |
| `DELETE /booking/{id}` | DELETE | `BookingClient.deleteBooking()` | `tests/regression/negative-scenarios.spec.js` |

### Health

| Endpoint | Method | Client Method | Test File |
|----------|--------|---------------|-----------|
| `GET /ping` | GET | `PingClient.healthCheck()` | `tests/smoke/health.spec.js` |
| `GET /ping` | GET | `PingClient.healthCheck()` | `tests/regression/response-headers.spec.js` |
| `GET /ping` | GET | `PingClient.healthCheck()` | `tests/regression/response-time.spec.js` |

### Integration Workflows

| Workflow | Test File |
|----------|-----------|
| Auth → Create → Get → Update → Delete | `tests/integration/booking-lifecycle.spec.js` |
| Auth → Create → Partial Update → Verify | `tests/integration/booking-lifecycle.spec.js` |
| Auth → Create → Full Replace → Verify | `tests/integration/booking-lifecycle.spec.js` |
| Auth → Create → Delete → Verify Gone | `tests/integration/booking-lifecycle.spec.js` |
| Auth → Create → Delete with token | `tests/integration/auth-booking-flow.spec.js` |
| Two tokens → Create + Update | `tests/integration/auth-booking-flow.spec.js` |
| Unauthorized update → Verify unchanged | `tests/integration/auth-booking-flow.spec.js` |

---

## Test Coverage Summary

| Category | Tests | Tag |
|----------|-------|-----|
| Health Check | 1 | `@smoke` |
| Authentication | 4 | `@smoke`, `@regression` |
| Booking CRUD | 14 | `@smoke`, `@regression` |
| Validation | 5 | `@regression` |
| Response Headers | 4 | `@regression` |
| Response Time | 4 | `@regression` |
| Authorization / Negative | 5 | `@regression` |
| Integration Workflows | 7 | `@integration` |
| **Total** | **44** | |

## Key Design Decisions

- **Cookie-based auth**: Tokens obtained via `POST /auth` are sent as `Cookie: token={value}` header
- **Resource-based clients**: One client per API resource, extending a shared base client
- **Reusable fixtures**: `ApiFixture` handles auth + provides typed clients
- **Separated test data**: All payloads in `data/testData.js`, never hardcoded in tests
- **Response time tracking**: Base client captures timing on every call; assertions validate against thresholds
- **JSON logging**: Structured logs written to `reports/logs/test-execution.log`
