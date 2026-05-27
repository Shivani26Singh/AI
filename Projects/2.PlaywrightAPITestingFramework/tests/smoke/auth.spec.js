const { test, expect } = require('@playwright/test');
const ApiFixture = require('../../fixtures/api.fixture');
const { authCredentials } = require('../../data/testData');
const { assertStatusCode, assertResponseTime, assertResponseHasField } = require('../../utils/assertions');

test.describe('@smoke Authentication', () => {

  test('POST /auth should return 200 with token', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.authClient.createToken(
      authCredentials.valid.username,
      authCredentials.valid.password
    );

    await assertStatusCode(response, 200);
    await assertResponseTime(response);
    await assertResponseHasField(response, 'token');
  });
});
