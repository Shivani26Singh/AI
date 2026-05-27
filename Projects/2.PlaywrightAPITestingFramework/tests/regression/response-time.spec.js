const { test } = require('@playwright/test');
const ApiFixture = require('../../fixtures/api.fixture');
const { validBooking } = require('../../data/testData');
const { assertResponseTime, assertStatusCode } = require('../../utils/assertions');

test.describe('@regression Response Time Validation', () => {

  test('GET /ping should respond within threshold', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.pingClient.healthCheck();

    await assertStatusCode(response, 201);
    await assertResponseTime(response, 3000);
  });

  test('POST /auth should respond within threshold', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.authClient.createToken('admin', 'password123');

    await assertStatusCode(response, 200);
    await assertResponseTime(response, 10000);
  });

  test('GET /booking should respond within threshold', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.bookingClient.getBookingIds();

    await assertStatusCode(response, 200);
    await assertResponseTime(response, 3000);
  });

  test('POST /booking should respond within threshold', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.bookingClient.createBooking(validBooking);

    await assertStatusCode(response, 200);
    await assertResponseTime(response, 3000);
  });
});
