const { test, expect } = require('@playwright/test');
const ApiFixture = require('../../fixtures/api.fixture');
const { authCredentials } = require('../../data/testData');
const {
  assertStatusCode,
  assertResponseTime,
  assertResponseHasField,
  assertResponseFieldType,
} = require('../../utils/assertions');

test.describe('@regression Auth API', () => {

  test('POST /auth with valid credentials should return 200 and token', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.authClient.createToken(
      authCredentials.valid.username,
      authCredentials.valid.password
    );

    await assertStatusCode(response, 200);
    await assertResponseTime(response);
    await assertResponseHasField(response, 'token');
    await assertResponseFieldType(response, 'token', 'string');

    const body = await response.json();
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('POST /auth with invalid credentials should return 200 with reason', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.authClient.createToken(
      authCredentials.invalid.username,
      authCredentials.invalid.password
    );

    await assertStatusCode(response, 200);

    const body = await response.json();
    expect(body).toHaveProperty('reason');
    expect(body.reason).toBe('Bad credentials');
  });

  test('POST /auth with empty credentials should handle gracefully', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.authClient.createToken(
      authCredentials.empty.username,
      authCredentials.empty.password
    );

    await assertStatusCode(response, 200);

    const body = await response.json();
    expect(body).toHaveProperty('reason');
  });
});
