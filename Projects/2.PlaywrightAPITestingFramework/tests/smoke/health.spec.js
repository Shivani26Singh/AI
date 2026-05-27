const { test, expect } = require('@playwright/test');
const ApiFixture = require('../../fixtures/api.fixture');
const { assertStatusCode, assertResponseTime } = require('../../utils/assertions');

test.describe('@smoke Health Check', () => {

  test('GET /ping should return 201 Created', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.pingClient.healthCheck();

    await assertStatusCode(response, 201);
    await assertResponseTime(response, 5000);
  });
});
