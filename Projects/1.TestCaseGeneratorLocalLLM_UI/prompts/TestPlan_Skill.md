# Instructions

You are generating an enterprise-grade Test Plan document from the provided PRD and supporting documents.

---

# PRIORITY ORDER

Follow these priorities in order:

1. Preserve all explicit PRD requirements
2. Never fabricate project-specific information
3. Preserve the template structure exactly
4. Prefer granular requirement coverage over generic summaries
5. Use placeholders when information is unavailable
6. Use generic enterprise examples only when PRD details are missing

---

# CORE GENERATION RULES

- Follow the exact same structure, hierarchy, numbering, formatting, headings, tables, and placeholders defined in the template.
- Do not remove, merge, reorder, or summarize template sections.
- Preserve all markdown formatting exactly.
- Generate ONLY the final Test Plan document.
- Do not include explanations, notes, disclaimers, or AI references.

---

# PRD EXTRACTION RULES

Extract and organize all explicit PRD information into the appropriate Test Plan sections.

This includes:
- functional requirements
- non-functional requirements
- workflows
- integrations
- user roles
- authentication methods
- security controls
- performance requirements
- scalability requirements
- accessibility requirements
- compliance requirements
- recovery mechanisms
- analytics requirements
- environments
- supported platforms/devices/browsers
- KPIs
- SLAs
- business goals
- operational constraints
- infrastructure requirements

---

# REQUIREMENT PRESERVATION RULES

Never collapse detailed PRD requirements into broad generic labels when explicit requirements are available.

Preserve explicit terminology whenever present in the PRD.

Examples:
- Multi-Factor Authentication (MFA/2FA)
- Single Sign-On (SSO)
- OAuth
- SAML
- Session Timeout
- Password Recovery
- Secure Token Handling
- Rate Limiting
- Brute Force Protection
- HTTPS Enforcement
- WCAG 2.1 AA
- GDPR
- CCPA
- OWASP
- CDN Deployment
- Multi-region Deployment
- Concurrent User Support
- Recovery Workflows
- Analytics Integrations

Do NOT replace detailed requirements with vague labels such as:
- Advanced Security
- Authentication System
- Performance Features
- Accessibility Features

---

# REQUIREMENT GRANULARITY RULES

Convert explicit PRD requirements into detailed and testable coverage items.

Examples:

If the PRD mentions:
- MFA
- Session Timeout
- Password Reset
- OAuth Login

Then generate individual testing coverage items for each requirement.

If the PRD mentions:
- 99.9% uptime
- page load under 2 seconds
- concurrent users

Then preserve them explicitly under:
- Evaluation Criteria
- Performance Testing
- Scalability Testing
- Reliability Testing

Do not compress multiple detailed requirements into generic summaries.

---

# SECTION MAPPING RULES

Map requirements contextually into the most appropriate Test Plan sections.

| Requirement Type | Preferred Section |
|---|---|
| Functional Features | Features to be Tested |
| Security Requirements | Security Testing / Risks |
| Accessibility Requirements | Accessibility Testing |
| Compliance Standards | Compliance Testing |
| Integrations | Integration Testing |
| User Flows | Test Scenarios |
| Recovery Flows | Recovery Testing |
| KPIs and SLAs | Evaluation Criteria |
| Scalability Requirements | Performance / Scalability Testing |
| Infrastructure Requirements | Environment / Performance Testing |
| Monitoring and Analytics | Integration Testing |
| Risks | Risks and Mitigations |

Do not centralize all extracted content into a single section.

---

# RISK EXTRACTION RULES

Extract operational, security, scalability, compliance, reliability, and infrastructure risks from the PRD.

Convert PRD risks into actionable QA validation coverage.

Examples:
- brute force attacks
- authentication failures
- session hijacking
- downtime risks
- scalability bottlenecks
- traffic spikes
- failover risks
- recovery risks

Prefer PRD-derived risks over generic template risks whenever available.

---

# KPI AND METRIC EXTRACTION RULES

Preserve measurable targets explicitly whenever available.

Examples:
- success rate targets
- SLA targets
- uptime requirements
- response time limits
- support ticket reduction goals
- concurrent user capacity
- accessibility compliance targets
- recovery objectives

Map measurable values into:
- Evaluation Criteria
- Performance Testing
- Reliability Testing
- Accessibility Validation
- Success Metrics

---

# PLACEHOLDER ENFORCEMENT RULES

Never invent project-specific values.

If information is unavailable, preserve placeholders.

Always use placeholders for unknown:
- dates
- timelines
- durations
- URLs
- reviewer names
- approvals
- metrics
- RAM/storage values
- infrastructure values
- credentials
- deployment details
- environment values

Examples:
- <Date>
- <Environment URL>
- <Enter Duration>
- <Reviewer Name>

---

# GENERIC EXAMPLE RULES

Generic enterprise examples may be used ONLY when the PRD does not provide explicit values.

Allowed examples include:
- Chrome
- Firefox
- Safari
- Edge
- Windows
- macOS
- Linux
- Android
- iOS
- JIRA
- Selenium
- JMeter
- Postman
- Confluence

Do not replace explicit PRD values with generic examples.

---

# REDUNDANCY RULES

Avoid repeating identical requirements unnecessarily across sections.

If a requirement is already covered in detail:
- reference it contextually,
- avoid duplicating long descriptions.

Maintain complete but concise coverage.

---

# DOMAIN ADAPTABILITY RULES

Adapt dynamically to the PRD domain.

Do not assume all systems are:
- authentication systems
- SaaS platforms
- e-commerce systems

Generate domain-specific testing coverage based on:
- workflows
- integrations
- business logic
- infrastructure
- architecture
- operational requirements

---

# FALLBACK BEHAVIOR

If PRD information is incomplete:
- preserve placeholders
- use generic enterprise examples
- avoid hallucinating features
- avoid inventing workflows
- avoid inventing integrations
- avoid inventing infrastructure

---

# FINAL VALIDATION

Before generating the final output, verify:

- every explicit PRD requirement appears in at least one Test Plan section
- all security requirements are preserved
- all compliance requirements are preserved
- all integrations are represented
- all workflows are represented
- all measurable KPIs are preserved
- no fabricated values exist
- placeholders remain for unknown values
- template structure is unchanged
- markdown formatting is preserved

---

# OUTPUT RESTRICTIONS

Generate ONLY the Test Plan document.

Do NOT include:
- explanations
- assistant commentary
- generation notes
- AI disclosures
- markdown code fences

The output must begin directly with:

# Test Plan for <Product Details>

---

# TEMPLATE

# Test Plan for <Product Details>

Author Name: <Author Name>  
Version: <Version Number>  
Date: <Date>  
Reviewed By: <Reviewer Name>  
Approval Status: <Pending / Approved / Rejected>

---

# Index

1. Objective  
2. Scope  
3. Inclusions  
4. Exclusions  
5. Test Environments  
6. Defect Reporting Procedure  
7. Test Strategy  
8. Test Schedule  
9. Test Deliverables  
10. Entry and Exit Criteria  
11. Tools  
12. Risks and Mitigations  
13. Approvals  

---

# 1. Objective

This document outlines the test plan for the **<Product Details>** application. The objective is to ensure that all features and functionalities work as expected for the target audience, **<Target Audience>**.

---

# 2. Scope

The scope of this test plan includes:

## Features to be tested

<Features>

## Types of testing

- Manual Testing
- Automated Testing
- Performance Testing
- Accessibility Testing
- Security Testing
- Compatibility Testing
- Regression Testing
- Compliance Testing
- Integration Testing
- Scalability Testing
- Reliability Testing
- Load Testing
- Recovery Testing

## Environments

Testing across different browsers, operating systems, network conditions, and device types.

## Evaluation Criteria

- Number of defects found
- Time taken to complete testing
- User satisfaction ratings
- Defect leakage percentage
- Test coverage percentage

## Team Roles and Responsibilities

- Test Lead
- Testers
- Developers
- Stakeholders
- DevOps Engineers
- Product Managers

---

# 3. Inclusions

## Introduction

Overview of the test plan including its purpose, scope, and goals.

## Test Objectives

- Identify defects in the application.
- Improve user experience.
- Ensure the system performs efficiently under expected load.
- Validate that all core functionalities work as expected.
- Validate security and accessibility compliance.

---

# 4. Exclusions

List any features or components that are out of scope for this test plan.

Examples:
- Third-party integrations not controlled by the application team.
- Future features planned for later releases.
- Beta or experimental modules.
- Internal infrastructure monitoring systems.

---

# 5. Test Environments

## Operating Systems

Examples:
- Windows 10
- Windows 11
- macOS
- Linux
- Android
- iOS

## Browsers

Examples:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

## Devices

Examples:
- Desktop computers
- Laptops
- Tablets
- Smartphones

## Network Connectivity

Examples:
- Wi-Fi
- Cellular networks
- Wired connections

## Hardware/Software Requirements

Examples:
- Minimum RAM: <Enter RAM Requirement>
- Minimum Storage: <Enter Storage Requirement>
- Stable internet connection
- SSL-enabled environment access
- Latest browser versions

## Security Protocols

Examples:
- Password authentication
- Tokens
- Certificates
- HTTPS/SSL
- SAML/OAuth

## Access Permissions

Roles assigned to team members such as:
- Testers
- Developers
- Stakeholders
- Administrators
- Product Owners

## Environment Details

| Environment | URL |
|---|---|
| QA | <Environment URL> |
| Staging | <Environment URL> |
| Production | <Environment URL> |

---

# 6. Defect Reporting Procedure

## Criteria for Identifying Defects

- Deviation from requirements
- User experience issues
- Technical errors or crashes
- Security vulnerabilities
- Accessibility violations

## Steps for Reporting Defects

1. Use the designated defect template.
2. Provide detailed reproduction steps.
3. Attach screenshots or logs where necessary.
4. Assign severity and priority.
5. Notify the relevant stakeholders.

## Triage and Prioritization

### Severity Levels

- Critical
- High
- Medium
- Low

### Priority Levels

- P1
- P2
- P3
- P4

## Tracking Tools

Examples:
- JIRA
- Azure DevOps
- Bugzilla
- Trello

## Roles and Responsibilities

- Testers log defects.
- Developers fix defects.
- Test Lead reviews and prioritizes.
- Stakeholders approve closure.

## Communication Channels

Examples:
- Daily stand-ups
- Status emails
- Project dashboards
- Slack
- Microsoft Teams

## Metrics

Examples:
- Number of defects found
- Time taken to resolve defects
- Percentage of defects fixed
- Reopened defect percentage
- Defect leakage percentage

---

# 7. Test Strategy

## Step 1: Test Scenarios and Test Cases Creation

### Techniques Used

- Equivalence Class Partitioning
- Boundary Value Analysis
- Decision Table Testing
- State Transition Testing
- Use Case Testing

### Additional Methods

- Error Guessing
- Exploratory Testing
- Risk-Based Testing

---

## Step 2: Testing Procedure

### Smoke Testing

To verify that critical functionalities work before detailed testing begins.

### In-Depth Testing

Execution of detailed test cases after the build passes Smoke Testing.

### Multiple Environments

Testing simultaneously across supported browsers, operating systems, and devices.

### Defect Reporting

Logging defects in the tracking tool and sharing daily status updates.

### Types of Testing

- Smoke Testing
- Sanity Testing
- Regression Testing
- Retesting
- Usability Testing
- Functionality Testing
- UI Testing
- Accessibility Testing
- Security Testing
- Performance Testing

---

## Step 3: Best Practices

### Context Driven Testing

Testing based on the application context and user scenarios.

### Shift Left Testing

Starting testing activities early in the development lifecycle.

### Exploratory Testing

Testing beyond predefined test cases to uncover hidden defects.

### End-to-End Flow Testing

Simulating real user journeys through the application.

---

# 8. Test Schedule

## Tasks and Estimated Time Duration

| Task | Duration |
|---|---|
| Requirement Analysis | <Enter Duration> |
| Test Plan Creation | <Enter Duration> |
| Test Scenario Creation | <Enter Duration> |
| Test Case Creation | <Enter Duration> |
| Test Execution | <Enter Duration> |
| Regression Testing | <Enter Duration> |
| Test Summary Report Submission | <Enter Duration> |

## Timeline

Specify start and end dates for each task.

Examples:
- Start Date: <Enter Start Date>
- End Date: <Enter End Date>

---

# 9. Test Deliverables

## Deliverables include

- Test Plan Document
- Test Scenarios
- Test Cases
- Requirement Traceability Matrix (RTM)
- Defect Reports
- Test Execution Reports
- Test Summary Reports

## Entry and Exit Criteria

Defined for each phase of the Software Testing Life Cycle (STLC).

---

# 10. Entry and Exit Criteria

## Requirement Analysis

### Entry Criteria

- Receiving Requirements Documents.
- PRD approved by stakeholders.

### Exit Criteria

- Requirements understood and clarified.
- Dependencies identified.

---

## Test Execution

### Entry Criteria

- Approved Test Scenarios and Test Cases.
- Application build ready for testing.
- Test environments accessible.

### Exit Criteria

- Test Case Reports completed.
- Defect Reports documented.
- Critical defects resolved.

---

## Test Closure

### Entry Criteria

- Test Case Reports available.
- Defect Reports available.
- Stakeholder review completed.

### Exit Criteria

- Test Summary Reports prepared and shared.
- Sign-off received from stakeholders.

---

# 11. Tools

## List of Tools

| Category | Tool |
|---|---|
| Bug Tracking Tool | <Enter Tool Name> |
| Automation Tool | <Enter Tool Name> |
| Performance Tool | <Enter Tool Name> |
| API Testing Tool | <Enter Tool Name> |
| Documentation Tool | <Enter Tool Name> |

Examples:
- JIRA
- Selenium
- JMeter
- Postman
- Confluence

---

# 12. Risks and Mitigations

Prefer PRD-derived operational, scalability, compliance, authentication, infrastructure, security, and performance risks whenever available.

| Risk | Mitigation |
|---|---|
| Non-availability of a key resource | Backup resource planning |
| Build URL not working | Work on parallel tasks |
| Limited time available for testing | Dynamically allocate additional resources |
| Delayed requirement clarification | Schedule stakeholder review meetings |
| Environment downtime | Maintain backup environments |

---

# 13. Approvals

## Documents for Client Approval

- Test Plan
- Test Scenarios
- Test Cases
- Test Reports
- Test Summary Reports

Approved By: ___________________________

Date: ___________________________