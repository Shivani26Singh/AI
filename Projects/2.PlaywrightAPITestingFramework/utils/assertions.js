const { expect } = require('@playwright/test');
const config = require('../config/config');

async function assertStatusCode(response, expectedStatus) {
  expect(response.status()).toBe(expectedStatus);
}

async function assertResponseTime(response, maxMs) {
  const threshold = maxMs || config.responseTimeThreshold;
  expect(response._responseTime).toBeLessThan(threshold);
}

async function assertJsonContentType(response) {
  const contentType = response.headers()['content-type'];
  expect(contentType).toContain('application/json');
}

async function assertResponseHasField(response, fieldPath) {
  const body = await response.json();
  const parts = fieldPath.split('.');
  let value = body;
  for (const part of parts) {
    expect(value, `Response missing field: ${fieldPath}`).toHaveProperty(part);
    value = value[part];
  }
}

async function assertResponseFieldEquals(response, fieldPath, expectedValue) {
  const body = await response.json();
  const parts = fieldPath.split('.');
  let value = body;
  for (const part of parts) {
    value = value[part];
  }
  expect(value).toBe(expectedValue);
}

async function assertResponseFieldType(response, fieldPath, expectedType) {
  const body = await response.json();
  const parts = fieldPath.split('.');
  let value = body;
  for (const part of parts) {
    value = value[part];
  }
  expect(typeof value).toBe(expectedType);
}

module.exports = {
  assertStatusCode,
  assertResponseTime,
  assertJsonContentType,
  assertResponseHasField,
  assertResponseFieldEquals,
  assertResponseFieldType,
};
