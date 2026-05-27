const { test, expect } = require('@playwright/test');
const ApiFixture = require('../../fixtures/api.fixture');
const { validBooking } = require('../../data/testData');
const { assertStatusCode } = require('../../utils/assertions');

test.describe('@integration Auth + Booking Authorization Flow', () => {

  test('Authenticate → create booking → delete with valid token should succeed', async ({ request }) => {
    const fixture = new ApiFixture(request);
    await fixture.authenticate();

    const createResponse = await fixture.bookingClient.createBooking(validBooking);
    await assertStatusCode(createResponse, 200);
    const createBody = await createResponse.json();
    const bookingId = createBody.bookingid;

    const deleteResponse = await fixture.bookingClient.deleteBooking(bookingId);
    await assertStatusCode(deleteResponse, 201);
  });

  test('Create booking → update with different auth token should work', async ({ request }) => {
    const fixture1 = new ApiFixture(request);
    await fixture1.authenticate();

    const createResponse = await fixture1.bookingClient.createBooking(validBooking);
    const createBody = await createResponse.json();
    const bookingId = createBody.bookingid;

    const fixture2 = new ApiFixture(request);
    await fixture2.authenticate();

    const updateResponse = await fixture2.bookingClient.updateBooking(bookingId, {
      firstname: 'DifferentUser',
      lastname: 'Test',
      totalprice: 300,
      depositpaid: true,
      bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
      additionalneeds: 'Lunch',
    });
    await assertStatusCode(updateResponse, 200);
  });

  test('Create booking → attempt unauthorized update → verify booking unchanged', async ({ request }) => {
    const fixture = new ApiFixture(request);

    const createResponse = await fixture.bookingClient.createBooking(validBooking);
    const createBody = await createResponse.json();
    const bookingId = createBody.bookingid;

    const unauthResponse = await fixture.bookingClient.updateBooking(bookingId, {
      firstname: 'Unauthorized',
      lastname: 'Change',
      totalprice: 500,
      depositpaid: false,
      bookingdates: { checkin: '2027-01-01', checkout: '2027-01-03' },
      additionalneeds: 'None',
    });
    await assertStatusCode(unauthResponse, 403);

    const getResponse = await fixture.bookingClient.getBooking(bookingId);
    const body = await getResponse.json();
    expect(body.firstname).toBe(validBooking.firstname);
    expect(body.lastname).toBe(validBooking.lastname);
  });
});
