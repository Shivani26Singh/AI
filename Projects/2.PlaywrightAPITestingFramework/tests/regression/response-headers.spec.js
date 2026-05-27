const { test, expect } = require('@playwright/test');
const ApiFixture = require('../../fixtures/api.fixture');
const { validBooking } = require('../../data/testData');
const {
  assertStatusCode,
  assertResponseTime,
  assertJsonContentType,
} = require('../../utils/assertions');

test.describe('@regression Response Header Validation', () => {

  test('GET /ping response should have valid headers', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.pingClient.healthCheck();

    const headers = response.headers();
    expect(headers).toHaveProperty('date');
    expect(headers).toHaveProperty('server');
  });

  test('POST /auth response should return application/json content-type', async ({ request }) => {
    const fixture = new ApiFixture(request);
    await fixture.authenticate();
    const token = fixture.token;

    const response = await fixture.authClient.createToken('admin', 'password123');

    await assertStatusCode(response, 200);
    await assertJsonContentType(response);
  });

  test('GET /booking response should have valid headers', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.bookingClient.getBookingIds();

    const headers = response.headers();
    expect(headers).toHaveProperty('content-type');
  });

  test('GET /booking/{id} response should have valid headers', async ({ request }) => {
    const fixture = new ApiFixture(request);

    const createResponse = await fixture.bookingClient.createBooking(validBooking);
    const createBody = await createResponse.json();
    const bookingId = createBody.bookingid;

    const response = await fixture.bookingClient.getBooking(bookingId);

    const headers = response.headers();
    expect(headers).toHaveProperty('content-type');
  });
});
