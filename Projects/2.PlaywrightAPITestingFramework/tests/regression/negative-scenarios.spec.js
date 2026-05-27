const { test, expect } = require('@playwright/test');
const ApiFixture = require('../../fixtures/api.fixture');
const { validBooking } = require('../../data/testData');
const { assertStatusCode } = require('../../utils/assertions');

test.describe('@regression Authorization & Negative Scenarios', () => {

  test('PUT /booking/{id} without auth token should return 403', async ({ request }) => {
    const fixture = new ApiFixture(request);

    const createResponse = await fixture.bookingClient.createBooking(validBooking);
    const createBody = await createResponse.json();
    const bookingId = createBody.bookingid;

    const response = await fixture.bookingClient.updateBooking(bookingId, {
      firstname: 'Hacker',
      lastname: 'Test',
      totalprice: 999,
      depositpaid: false,
      bookingdates: { checkin: '2026-01-01', checkout: '2026-01-02' },
      additionalneeds: 'None',
    });

    await assertStatusCode(response, 403);
  });

  test('PATCH /booking/{id} without auth token should return 403', async ({ request }) => {
    const fixture = new ApiFixture(request);

    const createResponse = await fixture.bookingClient.createBooking(validBooking);
    const createBody = await createResponse.json();
    const bookingId = createBody.bookingid;

    const response = await fixture.bookingClient.partialUpdateBooking(bookingId, {
      firstname: 'Hacker',
    });

    await assertStatusCode(response, 403);
  });

  test('DELETE /booking/{id} without auth token should return 403', async ({ request }) => {
    const fixture = new ApiFixture(request);

    const createResponse = await fixture.bookingClient.createBooking(validBooking);
    const createBody = await createResponse.json();
    const bookingId = createBody.bookingid;

    const response = await fixture.bookingClient.deleteBooking(bookingId);

    await assertStatusCode(response, 403);
  });

  test('POST /auth with invalid credentials should return reason Bad credentials', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.authClient.createToken('invalid_user', 'wrong_pass');

    await assertStatusCode(response, 200);

    const body = await response.json();
    expect(body).toHaveProperty('reason');
    expect(body.reason).toBe('Bad credentials');
  });

  test('GET /booking/{id} with non-existent ID should return 404', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.bookingClient.getBooking(99999999);

    await assertStatusCode(response, 404);
  });
});
