const { test, expect } = require('@playwright/test');
const ApiFixture = require('../../fixtures/api.fixture');
const { validBooking } = require('../../data/testData');
const { assertStatusCode, assertResponseTime, assertResponseHasField } = require('../../utils/assertions');

test.describe('@smoke Booking Core', () => {

  test('GET /booking should return 200 with booking ID array', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.bookingClient.getBookingIds();

    await assertStatusCode(response, 200);
    await assertResponseTime(response);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('POST /booking should return 200 with bookingid', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.bookingClient.createBooking(validBooking);

    await assertStatusCode(response, 200);
    await assertResponseTime(response);
    await assertResponseHasField(response, 'bookingid');
    await assertResponseHasField(response, 'booking');
  });
});
