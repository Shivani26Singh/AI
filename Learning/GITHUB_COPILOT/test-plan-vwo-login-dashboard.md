# Test Plan: VWO App — Login & Dashboard Pages

| Field | Details |
|---|---|
| **Project** | app.vwo.com |
| **Feature** | Login Page & Dashboard Page |
| **Version** | 1.0.0 |
| **Author** | Shivani Singh |
| **Created Date** | 2026-06-26 |
| **Target Release** | Upcoming |
| **Status** | Draft |

---

## 1. Objective

The objective of this test plan is to validate the **Login Page** and **Dashboard Page** of `app.vwo.com` before the upcoming release. We will verify that:

- Users can successfully authenticate using valid credentials (username, password, email).
- All login page elements (username, password, email ID, Forgot Password, Start Free Trial) function correctly.
- The Dashboard page renders correctly post-login with all expected components.
- The Logout functionality works as expected.
- Edge cases, negative scenarios, and security concerns are covered.
- The feature is stable enough for production release.

---

## 2. Scope

### 2.1 In Scope

| # | Area | Details |
|---|---|---|
| 1 | **Login — UI/UX** | Layout, responsiveness, field labels, button states, error messages, branding |
| 2 | **Login — Functional** | Valid login, invalid login, empty fields, field validations, Remember Me |
| 3 | **Login — Email ID Field** | Valid/invalid email formats, max length, special characters, copy-paste |
| 4 | **Login — Username Field** | Valid/invalid usernames, case sensitivity, max length, special characters |
| 5 | **Login — Password Field** | Masking, show/hide toggle, min/max length, copy-paste restrictions |
| 6 | **Login — Forgot Password** | Link navigation, email submission, success/error flows, token expiry |
| 7 | **Login — Start Free Trial** | Button visibility, navigation to signup/registration flow |
| 8 | **Login — Security** | Rate limiting, brute-force protection, session handling, CSRF, XSS |
| 9 | **Login — Accessibility** | Keyboard navigation, screen reader labels, focus order, ARIA attributes |
| 10 | **Login — Cross-Browser** | Chrome, Firefox, Safari, Edge |
| 11 | **Login — Responsive** | Desktop (1920×1080), Tablet (iPad), Mobile (iPhone, Pixel) |
| 12 | **Dashboard — UI/UX** | Layout, widgets, charts, navigation, branding consistency |
| 13 | **Dashboard — Functional** | Page load post-login, all dashboard components render, data accuracy |
| 14 | **Dashboard — Logout** | Logout button visibility, logout flow, session termination, redirect to login |
| 15 | **Dashboard — Navigation** | Sidebar/menu links, breadcrumbs, page transitions |
| 16 | **Dashboard — Performance** | Page load time, widget rendering time, API response times |
| 17 | **Dashboard — Accessibility** | Keyboard navigation, screen reader compatibility, color contrast |
| 18 | **Dashboard — Cross-Browser** | Chrome, Firefox, Safari, Edge |
| 19 | **Dashboard — Responsive** | Desktop, Tablet, Mobile viewports |
| 20 | **Integration** | Login → Dashboard flow, session persistence, token handling |
| 21 | **Regression** | Existing login/dashboard functionality remains intact |

### 2.2 Out of Scope

| # | Area | Reason |
|---|---|---|
| 1 | Other VWO app pages (Campaigns, Reports, Settings, etc.) | Separate test cycle |
| 2 | API-only testing of backend services | Separate API test plan |
| 3 | Third-party integrations (Google SSO, SAML, etc.) | Not part of this release |
| 4 | Load/stress testing beyond basic performance checks | Requires dedicated performance cycle |
| 5 | Database-level validation | Handled by backend QA |
| 6 | Mobile native app testing | Web-only for this cycle |

---

## 3. Assumptions

| # | Assumption | Risk Level |
|---|---|---|
| A1 | Test environment (QA/Staging) is available and stable | Low |
| A2 | Valid test user accounts exist with known credentials | Low |
| A3 | The login page URL is `https://app.vwo.com/login` | Low |
| A4 | The dashboard is the default landing page after successful login | Low |
| A5 | No breaking UI changes are planned before release | Medium |
| A6 | Backend APIs for login and dashboard are functional | Low |
| A7 | Test data (valid/invalid users) is seeded in the test environment | Low |
| A8 | BrowserStack or similar cross-browser testing tool is available | Medium |
| A9 | `Risk:` If test environment is down, testing will be blocked | High |

---

## 4. Test Approach

### 4.1 Testing Levels

| Level | Description | Coverage |
|---|---|---|
| **Smoke Testing** | Quick validation of critical paths (login → dashboard → logout) | Every build |
| **Functional Testing** | All login & dashboard features per requirements | Full pass |
| **UI/UX Testing** | Visual layout, responsiveness, consistency | Full pass |
| **Negative Testing** | Invalid inputs, error states, boundary conditions | Full pass |
| **Security Testing** | Rate limiting, session handling, input sanitization | Targeted |
| **Accessibility Testing** | WCAG 2.1 AA compliance (keyboard, screen reader, contrast) | Targeted |
| **Cross-Browser Testing** | Chrome, Firefox, Safari, Edge (latest 2 versions) | Full pass |
| **Responsive Testing** | Desktop (1920×1080), Tablet (768×1024), Mobile (375×812) | Full pass |
| **Integration Testing** | Login → Dashboard flow, session management | Full pass |
| **Regression Testing** | Existing functionality verification | Full pass |
| **Exploratory Testing** | Ad-hoc discovery of edge cases and usability issues | Time-boxed (2 hrs) |

### 4.2 Automation Scope

| Area | Automate? | Tool | Priority |
|---|---|---|---|
| Login — valid credentials | ✅ Yes | Playwright + TypeScript | High |
| Login — invalid credentials | ✅ Yes | Playwright + TypeScript | High |
| Login — empty field validation | ✅ Yes | Playwright + TypeScript | Medium |
| Login — Forgot Password flow | ✅ Yes | Playwright + TypeScript | Medium |
| Dashboard — page load | ✅ Yes | Playwright + TypeScript | High |
| Dashboard — logout | ✅ Yes | Playwright + TypeScript | High |
| Dashboard — navigation | ✅ Yes | Playwright + TypeScript | Medium |
| Visual regression (screenshots) | ✅ Yes | Playwright visual comparison | Medium |
| Cross-browser | ✅ Yes | Playwright multi-project config | Medium |

---

## 5. Test Scenarios

### 5.1 Login Page — Functional Scenarios

| ID | Scenario | Priority | Type | Precondition | Expected Result |
|---|---|---|---|---|---|
| **TP-001** | Verify login with valid username and password | 🔴 High | Functional + Smoke | Valid user account exists | User is redirected to Dashboard; session token is set |
| **TP-002** | Verify login with valid email and password | 🔴 High | Functional + Smoke | Valid user account exists | User is redirected to Dashboard |
| **TP-003** | Verify login with invalid password | 🔴 High | Negative | Valid username/email | Error message: "Invalid credentials" or similar; no redirect |
| **TP-004** | Verify login with invalid username | 🟡 Medium | Negative | N/A | Error message displayed; no redirect |
| **TP-005** | Verify login with invalid email format | 🟡 Medium | Negative | N/A | Inline validation error: "Please enter a valid email" |
| **TP-006** | Verify login with empty username field | 🟡 Medium | Negative | N/A | Validation error on username field; login button disabled or error shown |
| **TP-007** | Verify login with empty password field | 🟡 Medium | Negative | N/A | Validation error on password field |
| **TP-008** | Verify login with both fields empty | 🟡 Medium | Negative | N/A | Both fields show validation errors |
| **TP-009** | Verify login with username containing special characters | 🟢 Low | Edge | N/A | Appropriate validation or successful login if allowed |
| **TP-010** | Verify login with very long username (>255 chars) | 🟢 Low | Boundary | N/A | Field truncation or validation error |
| **TP-011** | Verify login with very long password (>128 chars) | 🟢 Low | Boundary | N/A | Appropriate handling (accept or reject with message) |
| **TP-012** | Verify login with SQL injection in username field | 🟡 Medium | Security | N/A | Input sanitized; no SQL error exposed; generic error message |
| **TP-013** | Verify login with XSS payload in username field | 🟡 Medium | Security | N/A | Script not executed; input sanitized |
| **TP-014** | Verify login with leading/trailing spaces in username | 🟢 Low | Edge | Valid user exists | Spaces trimmed; login succeeds |
| **TP-015** | Verify login with leading/trailing spaces in password | 🟢 Low | Edge | Valid user exists | Password treated literally (spaces not trimmed) |
| **TP-016** | Verify "Remember Me" checkbox functionality | 🟡 Medium | Functional | Valid credentials | Session persists after browser close |
| **TP-017** | Verify password field masking (characters hidden) | 🟡 Medium | UI | N/A | Password displayed as dots/asterisks |
| **TP-018** | Verify password show/hide toggle | 🟢 Low | UI | N/A | Clicking toggle reveals/hides password text |
| **TP-019** | Verify Enter key submits the login form | 🟡 Medium | Functional | Valid credentials entered | Form submits on Enter key press |
| **TP-020** | Verify Tab key navigation order | 🟢 Low | Accessibility | N/A | Tab follows: Username → Password → Submit → Forgot Password → Free Trial |
| **TP-021** | Verify login page loads within acceptable time (<3s) | 🟡 Medium | Performance | N/A | Page fully loaded in under 3 seconds |
| **TP-022** | Verify login with case-sensitive username (if applicable) | 🟢 Low | Edge | Valid user exists | Consistent behavior (case-sensitive or insensitive as designed) |
| **TP-023** | Verify copy-paste into username field | 🟢 Low | Edge | N/A | Paste works normally |
| **TP-024** | Verify copy-paste into password field | 🟢 Low | Edge | N/A | Paste may be restricted per security policy |
| **TP-025** | Verify browser autofill works for login fields | 🟢 Low | UX | Browser has saved credentials | Autofill populates username and password |

### 5.2 Login Page — Email ID Field Scenarios

| ID | Scenario | Priority | Type | Expected Result |
|---|---|---|---|---|
| **TP-026** | Verify login with valid email format (user@domain.com) | 🔴 High | Functional | Login proceeds to password step or full login |
| **TP-027** | Verify login with email missing @ symbol | 🟡 Medium | Negative | Validation error: "Please enter a valid email" |
| **TP-028** | Verify login with email missing domain (user@) | 🟡 Medium | Negative | Validation error |
| **TP-029** | Verify login with email missing username (@domain.com) | 🟡 Medium | Negative | Validation error |
| **TP-030** | Verify login with email containing multiple @ symbols | 🟢 Low | Edge | Validation error |
| **TP-031** | Verify login with email containing spaces | 🟢 Low | Edge | Validation error or trimmed |
| **TP-032** | Verify login with email containing special characters in local part | 🟢 Low | Edge | Accepted if RFC-compliant; rejected otherwise |
| **TP-033** | Verify login with unicode/IDN email | 🟢 Low | Edge | Appropriate handling per system design |
| **TP-034** | Verify login with very long email (>254 chars) | 🟢 Low | Boundary | Validation error or truncation |

### 5.3 Login Page — Forgot Password Scenarios

| ID | Scenario | Priority | Type | Expected Result |
|---|---|---|---|---|
| **TP-035** | Verify "Forgot Password" link is visible and clickable | 🔴 High | Functional | Link navigates to forgot password page |
| **TP-036** | Verify forgot password with valid registered email | 🔴 High | Functional | Success message: "Password reset link sent to your email" |
| **TP-037** | Verify forgot password with unregistered email | 🟡 Medium | Negative | Appropriate message (security: don't reveal if email exists) |
| **TP-038** | Verify forgot password with empty email field | 🟡 Medium | Negative | Validation error: "Please enter your email" |
| **TP-039** | Verify forgot password with invalid email format | 🟡 Medium | Negative | Validation error: "Please enter a valid email" |
| **TP-040** | Verify forgot password rate limiting (multiple rapid requests) | 🟡 Medium | Security | Rate limited after N attempts; appropriate message |
| **TP-041** | Verify password reset email is received (check inbox) | 🟡 Medium | Integration | Email received within 2 minutes with reset link |
| **TP-042** | Verify password reset link token expiry | 🟡 Medium | Functional | Expired token shows appropriate error |
| **TP-043** | Verify password reset with already-used token | 🟢 Low | Security | Token cannot be reused; error message shown |
| **TP-044** | Verify "Back to Login" link on forgot password page | 🟢 Low | Functional | Returns to login page |

### 5.4 Login Page — Start Free Trial Scenarios

| ID | Scenario | Priority | Type | Expected Result |
|---|---|---|---|---|
| **TP-045** | Verify "Start Free Trial" button is visible | 🟡 Medium | UI | Button prominently displayed on login page |
| **TP-046** | Verify "Start Free Trial" button click navigation | 🟡 Medium | Functional | Navigates to signup/registration page |
| **TP-047** | Verify "Start Free Trial" button styling and hover state | 🟢 Low | UI | Button has distinct styling; hover state visible |
| **TP-048** | Verify "Start Free Trial" button on mobile viewport | 🟡 Medium | Responsive | Button visible and tappable on mobile |

### 5.5 Login Page — UI & Responsive Scenarios

| ID | Scenario | Priority | Type | Expected Result |
|---|---|---|---|---|
| **TP-049** | Verify login page layout on Desktop (1920×1080) | 🟡 Medium | UI | All elements properly aligned; no overlapping |
| **TP-050** | Verify login page layout on Tablet (768×1024) | 🟡 Medium | Responsive | Responsive layout; all elements accessible |
| **TP-051** | Verify login page layout on Mobile (375×812) | 🟡 Medium | Responsive | Mobile-optimized layout; no horizontal scroll |
| **TP-052** | Verify VWO branding/logo on login page | 🟢 Low | UI | Logo visible and correctly positioned |
| **TP-053** | Verify error message styling (color, position, visibility) | 🟡 Medium | UI | Error messages in red; clearly associated with relevant field |
| **TP-054** | Verify loading spinner/state during login submission | 🟡 Medium | UX | Loading indicator shown; button disabled during submission |
| **TP-055** | Verify login page in Chrome | 🔴 High | Cross-Browser | All functionality works |
| **TP-056** | Verify login page in Firefox | 🔴 High | Cross-Browser | All functionality works |
| **TP-057** | Verify login page in Safari | 🟡 Medium | Cross-Browser | All functionality works |
| **TP-058** | Verify login page in Edge | 🟡 Medium | Cross-Browser | All functionality works |

### 5.6 Login Page — Session & Security Scenarios

| ID | Scenario | Priority | Type | Expected Result |
|---|---|---|---|---|
| **TP-059** | Verify session timeout after inactivity | 🟡 Medium | Security | User is logged out after configured idle timeout |
| **TP-060** | Verify login with HTTP (non-HTTPS) redirects to HTTPS | 🔴 High | Security | Always served over HTTPS |
| **TP-061** | Verify brute-force protection (multiple failed logins) | 🔴 High | Security | Account locked or rate-limited after N failed attempts |
| **TP-062** | Verify CSRF token presence on login form | 🟡 Medium | Security | CSRF token included in form submission |
| **TP-063** | Verify sensitive data not exposed in URL parameters | 🟡 Medium | Security | No credentials in URL after failed login |
| **TP-064** | Verify session cookie attributes (HttpOnly, Secure, SameSite) | 🟡 Medium | Security | Cookies have secure attributes set |
| **TP-065** | Verify concurrent session handling (login from multiple devices) | 🟢 Low | Security | Per system design (allow or terminate previous session) |
| **TP-066** | Verify back button after logout doesn't show dashboard | 🔴 High | Security | Back button shows login page, not cached dashboard |

### 5.7 Dashboard Page — Functional Scenarios

| ID | Scenario | Priority | Type | Expected Result |
|---|---|---|---|---|
| **TP-067** | Verify dashboard loads after successful login | 🔴 High | Functional + Smoke | Dashboard page renders with all core widgets |
| **TP-068** | Verify dashboard URL is correct | 🟡 Medium | Functional | URL matches expected dashboard path |
| **TP-069** | Verify dashboard page title | 🟢 Low | UI | Browser tab shows appropriate title |
| **TP-070** | Verify all dashboard widgets/components render | 🔴 High | Functional | All expected widgets visible; no broken/empty panels |
| **TP-071** | Verify dashboard data is accurate and up-to-date | 🔴 High | Functional | Displayed data matches backend data |
| **TP-072** | Verify dashboard loads within acceptable time (<5s) | 🟡 Medium | Performance | Full dashboard renders in under 5 seconds |
| **TP-073** | Verify dashboard refresh/reload functionality | 🟡 Medium | Functional | Page reloads correctly; data refreshes |
| **TP-074** | Verify dashboard with no data state (new user) | 🟡 Medium | Edge | Empty states shown with helpful messages, not errors |
| **TP-075** | Verify dashboard with large data sets | 🟢 Low | Performance | Dashboard handles large data without crashing |

### 5.8 Dashboard Page — Logout Scenarios

| ID | Scenario | Priority | Type | Expected Result |
|---|---|---|---|---|
| **TP-076** | Verify logout button is visible on dashboard | 🔴 High | Functional + Smoke | Logout button/link clearly visible |
| **TP-077** | Verify logout flow completes successfully | 🔴 High | Functional + Smoke | User logged out; redirected to login page |
| **TP-078** | Verify session is terminated after logout | 🔴 High | Security | Session token invalidated; cannot access dashboard via back button |
| **TP-079** | Verify logout from all devices option (if available) | 🟢 Low | Functional | All active sessions terminated |
| **TP-080** | Verify logout confirmation dialog (if applicable) | 🟢 Low | UX | Confirmation prompt before logout |
| **TP-081** | Verify auto-logout after session expiry | 🟡 Medium | Security | User redirected to login with session expired message |

### 5.9 Dashboard Page — Navigation Scenarios

| ID | Scenario | Priority | Type | Expected Result |
|---|---|---|---|---|
| **TP-082** | Verify sidebar/menu navigation links work | 🟡 Medium | Functional | All links navigate to correct pages |
| **TP-083** | Verify active/current page is highlighted in navigation | 🟢 Low | UI | Current page indicator visible |
| **TP-084** | Verify breadcrumb navigation (if present) | 🟢 Low | UI | Breadcrumbs show correct path; clickable |
| **TP-085** | Verify user profile/avatar is displayed | 🟡 Medium | UI | User name/avatar visible in header |
| **TP-086** | Verify notification bell/icon (if present) | 🟢 Low | Functional | Notification icon visible; shows count if applicable |

### 5.10 Dashboard Page — UI & Responsive Scenarios

| ID | Scenario | Priority | Type | Expected Result |
|---|---|---|---|---|
| **TP-087** | Verify dashboard layout on Desktop (1920×1080) | 🟡 Medium | UI | Full layout; all widgets visible |
| **TP-088** | Verify dashboard layout on Tablet (768×1024) | 🟡 Medium | Responsive | Responsive layout; widgets stack/reflow |
| **TP-089** | Verify dashboard layout on Mobile (375×812) | 🟡 Medium | Responsive | Mobile-optimized; key info accessible |
| **TP-090** | Verify dashboard in Chrome | 🔴 High | Cross-Browser | All functionality works |
| **TP-091** | Verify dashboard in Firefox | 🔴 High | Cross-Browser | All functionality works |
| **TP-092** | Verify dashboard in Safari | 🟡 Medium | Cross-Browser | All functionality works |
| **TP-093** | Verify dashboard in Edge | 🟡 Medium | Cross-Browser | All functionality works |
| **TP-094** | Verify dashboard color contrast meets WCAG AA | 🟢 Low | Accessibility | Contrast ratio ≥ 4.5:1 for normal text |
| **TP-095** | Verify dashboard is keyboard navigable | 🟡 Medium | Accessibility | All interactive elements reachable via Tab |

### 5.11 Integration — End-to-End Flow

| ID | Scenario | Priority | Type | Expected Result |
|---|---|---|---|---|
| **TP-096** | Verify complete flow: Login → Dashboard → Logout → Login | 🔴 High | Integration | Full cycle works without errors |
| **TP-097** | Verify session persistence across page refreshes | 🟡 Medium | Integration | User stays logged in after refresh |
| **TP-098** | Verify direct dashboard URL access without login redirects to login | 🔴 High | Security | Unauthenticated access redirects to login |
| **TP-099** | Verify login redirect to originally requested page | 🟡 Medium | Integration | After login, user goes to the page they originally requested |
| **TP-100** | Verify multiple tabs share the same session | 🟢 Low | Integration | Opening new tab maintains authenticated session |

---

## 6. Test Data

| Data Need | Example / Value | Source | Notes |
|---|---|---|---|
| Valid user (username + password) | `qa_testuser / Test@12345` | Seed data / Test env | Must have active VWO account |
| Valid user (email + password) | `qa_testuser@thetestingacademy.com / Test@12345` | Seed data / Test env | Email-based login |
| Invalid username | `invalid_user_xyz` | Generated | Non-existent user |
| Invalid email | `noexist@example.com` | Generated | Non-registered email |
| Invalid password | `WrongPass999!` | Generated | Wrong password for valid user |
| Locked/disabled account | `locked_user@example.com` | Seed data | For account lockout testing |
| Malformed emails | `notanemail`, `user@`, `@domain.com` | Generated | For email validation tests |
| XSS payload | `<script>alert(1)</script>` | Test data | For security testing |
| SQL injection payload | `' OR '1'='1` | Test data | For security testing |
| Long strings (>255 chars) | Generated string | Generated | For boundary testing |
| Unicode/special chars | `用户名@测试.com` | Generated | For internationalization testing |

---

## 7. Environment

| Environment | URL | Purpose | Owner |
|---|---|---|---|
| **QA / Staging** | `https://app.vwo.com` (or staging URL) | Main testing environment | QA Team |
| **Production** | `https://app.vwo.com` | Smoke tests post-release | Ops / QA |
| **Local** | `http://localhost:3000` | Development debugging | Dev Team |

### Browser Matrix

| Browser | Version | OS |
|---|---|---|
| Google Chrome | Latest & Latest-1 | macOS, Windows |
| Mozilla Firefox | Latest & Latest-1 | macOS, Windows |
| Apple Safari | Latest | macOS |
| Microsoft Edge | Latest | Windows |
| Mobile Chrome | Latest | Android (Pixel 7) |
| Mobile Safari | Latest | iOS (iPhone 14) |

---

## 8. Entry Criteria

- [ ] Requirements for Login and Dashboard pages are finalized and signed off.
- [ ] Build is deployed to the QA/Staging environment.
- [ ] Test data (valid users, invalid users, locked accounts) is available.
- [ ] Test environment is stable and accessible.
- [ ] All critical dependencies (auth service, dashboard API) are operational.
- [ ] Test automation framework (Playwright) is set up and configured.
- [ ] Test cases are reviewed and approved.

---

## 9. Exit Criteria

- [ ] All **High-priority** test cases (🔴) executed and passed.
- [ ] All **Medium-priority** test cases (🟡) executed; any failures documented.
- [ ] No open **Blocker** or **Critical** defects.
- [ ] All **High-severity** defects are fixed and re-tested.
- [ ] Known issues are documented with workarounds (if any) and accepted by stakeholders.
- [ ] Automation suite for smoke tests is green.
- [ ] Cross-browser testing completed for Chrome, Firefox, Safari, Edge.
- [ ] Responsive testing completed for Desktop, Tablet, Mobile.
- [ ] Security checks (HTTPS, session handling, input sanitization) passed.
- [ ] Test summary report is shared with stakeholders.
- [ ] Sign-off obtained from QA Lead and Product Manager.

---

## 10. Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| Test environment instability or downtime | **High** — Blocks all testing | Medium | Confirm environment health before test cycle; have backup env |
| Test data not available or outdated | **High** — Cannot execute login tests | Low | Prepare and validate seed data before test cycle starts |
| UI changes between test cycle and release | **Medium** — Invalidates UI tests | Medium | Freeze UI changes during test cycle; communicate changes |
| Third-party auth service outage | **High** — Login completely blocked | Low | Have mock/stub for auth service as fallback |
| Cross-browser inconsistencies | **Medium** — Poor UX on some browsers | Medium | Run cross-browser tests early; use BrowserStack |
| Performance degradation on dashboard | **Medium** — Slow dashboard affects UX | Low | Include performance checks in test cycle |
| Incomplete requirements for edge cases | **Medium** — Gaps in test coverage | Medium | Clarify with PM before test cycle; document assumptions |
| Automation framework setup delays | **Low** — Manual testing can cover | Low | Start automation setup in parallel with manual testing |

---

## 11. Defect Severity Classification

| Severity | Definition | Example |
|---|---|---|
| **Blocker** | Completely blocks testing or release | Login page doesn't load; 500 error on submit |
| **Critical** | Core functionality broken, no workaround | Valid users cannot log in; dashboard blank |
| **High** | Major feature broken, limited workaround | Forgot password flow broken; logout not working |
| **Medium** | Feature partially broken, workaround exists | Validation message missing; minor UI glitch |
| **Low** | Cosmetic issue, no functional impact | Typo in error message; misaligned icon |

---

## 12. Test Schedule

| Phase | Activity | Duration | Owner |
|---|---|---|---|
| **Phase 1** | Test planning & test case review | 1 day | QA Lead |
| **Phase 2** | Test data preparation & environment setup | 0.5 day | QA + DevOps |
| **Phase 3** | Smoke testing (TP-001, TP-002, TP-067, TP-076, TP-077) | 2 hours | QA |
| **Phase 4** | Functional testing — Login page | 2 days | QA |
| **Phase 5** | Functional testing — Dashboard page | 1.5 days | QA |
| **Phase 6** | Negative & edge case testing | 1 day | QA |
| **Phase 7** | Security testing | 1 day | QA + Security |
| **Phase 8** | Cross-browser & responsive testing | 1 day | QA |
| **Phase 9** | Accessibility testing | 0.5 day | QA |
| **Phase 10** | Integration & regression testing | 1 day | QA |
| **Phase 11** | Automation execution & report | 0.5 day | QA Automation |
| **Phase 12** | Exploratory testing | 2 hours | QA |
| **Phase 13** | Defect retesting & regression | 1 day | QA |
| **Phase 14** | Test summary & sign-off | 0.5 day | QA Lead |

**Total Estimated Duration: ~10 working days**

---

## 13. Deliverables

| Deliverable | Format | Owner |
|---|---|---|
| Test Plan (this document) | Markdown / PDF | QA Lead |
| Test Cases (100 scenarios) | Test management tool / Spreadsheet | QA |
| Defect Reports | Jira / Bug tracking tool | QA |
| Automation Test Scripts | Playwright TypeScript (Git repo) | QA Automation |
| Automation Execution Report | HTML / JSON report | QA Automation |
| Test Execution Summary | Markdown / PDF | QA Lead |
| Traceability Matrix | Spreadsheet | QA |
| Sign-off Document | PDF / Email | QA Lead + PM |

---

## 14. Tools

| Tool | Purpose |
|---|---|
| **Playwright + TypeScript** | Test automation framework |
| **Jira** | Defect tracking & test case management |
| **BrowserStack / LambdaTest** | Cross-browser testing (if needed) |
| **Lighthouse / axe-core** | Accessibility testing |
| **Chrome DevTools** | Performance & network debugging |
| **Postman** | API debugging (auth endpoints) |
| **Git / GitHub** | Version control for automation code |
| **Slack / Teams** | Communication & reporting |

---

## 15. Approvals

| Role | Name | Status | Date |
|---|---|---|---|
| QA Owner | Shivani Singh | Pending | TBD |
| QA Lead | TBD | Pending | TBD |
| Product Manager | TBD | Pending | TBD |
| Engineering Lead | TBD | Pending | TBD |
| Release Manager | TBD | Pending | TBD |

---

## Appendix A: Login Page Wireframe Reference

```
┌──────────────────────────────────────────┐
│              [VWO Logo]                  │
│                                          │
│         Sign in to your account          │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  Username / Email                  │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  Password                    [👁]  │  │
│  └────────────────────────────────────┘  │
│                                          │
│  [ ] Remember Me                        │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │           SIGN IN                  │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Forgot Password?                        │
│                                          │
│  ────────── OR ──────────               │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │     START A FREE TRIAL             │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

## Appendix B: Dashboard Page Wireframe Reference

```
┌──────────────────────────────────────────────────────┐
│  [VWO Logo]    [Search]    [🔔] [👤 User ▼] [Logout] │
├──────────┬───────────────────────────────────────────┤
│          │                                           │
│  Sidebar │         Dashboard Content Area            │
│          │                                           │
│  • Home  │  ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  • Camp. │  │ Widget 1│ │ Widget 2│ │ Widget 3│    │
│  • Rep.  │  └─────────┘ └─────────┘ └─────────┘    │
│  • Users │                                           │
│  • Set.  │  ┌──────────────────────────────────┐    │
│          │  │         Chart / Graph             │    │
│          │  └──────────────────────────────────┘    │
│          │                                           │
│          │  ┌──────────────────────────────────┐    │
│          │  │         Data Table                │    │
│          │  └──────────────────────────────────┘    │
│          │                                           │
└──────────┴───────────────────────────────────────────┘
```

---

> **Document Version:** 1.0 | **Last Updated:** 2026-06-26 | **Author:** Shivani Singh