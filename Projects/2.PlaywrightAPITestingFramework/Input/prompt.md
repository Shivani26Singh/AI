# Generate Playwright API Framework

Generate a complete, production-ready Playwright API automation framework in JavaScript.

Follow ALL standards, architecture rules, coding conventions, framework patterns, and output requirements defined in the attached:

playwright-api-framework-generator.SKILL.md

Analyze the attached API specification and design the framework before generating code.

## Required Deliverables

Generate:

- Framework Architecture
- Folder Structure
- package.json
- playwright.config.js
- Environment Configuration
- API Client Layer
- Fixtures
- Utilities
- Test Data Management
- Reporting Configuration
- CI/CD Configuration
- Smoke Test Suite
- Regression Test Suite
- Integration Test Suite (if applicable)
- README

## Framework Requirements

- JavaScript only
- Playwright APIRequestContext
- Resource-based Client Architecture
- Reusable Fixtures
- Environment-driven Configuration
- HTML Reporting
- Allure Reporting
- Enterprise-grade Maintainability
- Production-ready Implementation

## Coverage Requirements

Generate tests for:

- Authentication
- Authorization
- CRUD Operations
- Validation Rules
- Error Handling
- Boundary Conditions
- Response Header Validation
- Response Time Validation
- Negative Scenarios

## Traceability Requirements

Generate a coverage mapping section:

Endpoint
→ Client Method
→ Test File

Example:

POST /users
→ userClient.createUser()
→ tests/regression/users-create.spec.js

## Constraints

- Do not invent endpoints.
- Do not invent request fields.
- Do not invent response fields.
- Do not invent status codes.
- Do not invent authentication mechanisms.
- Use only information provided in the API specification.

If required information is missing, return:

CLARIFICATION_REQUIRED

with a list of missing details.

Generate a fully runnable framework.

Do not generate sample snippets only.