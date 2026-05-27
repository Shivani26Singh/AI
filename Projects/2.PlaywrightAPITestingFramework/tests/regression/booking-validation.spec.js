const { test, expect } = require('@playwright/test');
const ApiFixture = require('../../fixtures/api.fixture');
const {
  validBooking,
  bookingMissingRequired,
  bookingInvalidTotalPrice,
  bookingInvalidDateFormat,
  bookingBoundaryMinPrice,
} = require('../../data/testData');
const { assertStatusCode } = require('../../utils/assertions');

test.describe('@regression Booking Validation', () => {

  test('POST /booking with missing required fields should return 500', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.bookingClient.createBooking(bookingMissingRequired);

    await assertStatusCode(response, 500);
  });

  test('POST /booking with invalid totalprice type should handle gracefully', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.bookingClient.createBooking(bookingInvalidTotalPrice);

    const status = response.status();
    expect([200, 500]).toContain(status);
  });

  test('POST /booking with minimum totalprice boundary should succeed', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.bookingClient.createBooking(bookingBoundaryMinPrice);

    await assertStatusCode(response, 200);

    const body = await response.json();
    expect(body.booking.totalprice).toBe(0);
  });

  test('POST /booking with depositpaid as false should succeed', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const payload = { ...validBooking, depositpaid: false };
    const response = await fixture.bookingClient.createBooking(payload);

    await assertStatusCode(response, 200);

    const body = await response.json();
    expect(body.booking.depositpaid).toBe(false);
  });

  test('POST /booking with depositpaid as true should succeed', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const payload = { ...validBooking, depositpaid: true };
    const response = await fixture.bookingClient.createBooking(payload);

    await assertStatusCode(response, 200);

    const body = await response.json();
    expect(body.booking.depositpaid).toBe(true);
  });
});
