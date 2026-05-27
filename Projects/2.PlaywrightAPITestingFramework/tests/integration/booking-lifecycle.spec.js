const { test, expect } = require('@playwright/test');
const ApiFixture = require('../../fixtures/api.fixture');
const { validBooking, fullUpdatePayload, partialUpdatePayload } = require('../../data/testData');
const { assertStatusCode, assertResponseTime } = require('../../utils/assertions');

test.describe('@integration Booking Lifecycle', () => {

  test('Full booking lifecycle: Auth → Create → Get → Update → Delete', async ({ request }) => {
    const fixture = new ApiFixture(request);

    await fixture.authenticate();
    const token = fixture.token;
    expect(token).toBeTruthy();

    const createResponse = await fixture.bookingClient.createBooking(validBooking);
    await assertStatusCode(createResponse, 200);
    const createBody = await createResponse.json();
    const bookingId = createBody.bookingid;
    expect(typeof bookingId).toBe('number');

    const getResponse = await fixture.bookingClient.getBooking(bookingId);
    await assertStatusCode(getResponse, 200);
    const getBody = await getResponse.json();
    expect(getBody.firstname).toBe(validBooking.firstname);
    expect(getBody.lastname).toBe(validBooking.lastname);

    const updateResponse = await fixture.bookingClient.updateBooking(bookingId, fullUpdatePayload);
    await assertStatusCode(updateResponse, 200);

    const verifyResponse = await fixture.bookingClient.getBooking(bookingId);
    const verifyBody = await verifyResponse.json();
    expect(verifyBody.firstname).toBe(fullUpdatePayload.firstname);
    expect(verifyBody.lastname).toBe(fullUpdatePayload.lastname);

    const deleteResponse = await fixture.bookingClient.deleteBooking(bookingId);
    await assertStatusCode(deleteResponse, 201);

    const afterDeleteResponse = await fixture.bookingClient.getBooking(bookingId);
    await assertStatusCode(afterDeleteResponse, 404);
  });

  test('Auth → Create → Partial Update → Verify only updated fields changed', async ({ request }) => {
    const fixture = new ApiFixture(request);

    await fixture.authenticate();

    const createResponse = await fixture.bookingClient.createBooking(validBooking);
    const createBody = await createResponse.json();
    const bookingId = createBody.bookingid;

    const patchResponse = await fixture.bookingClient.partialUpdateBooking(bookingId, partialUpdatePayload);
    await assertStatusCode(patchResponse, 200);

    const getResponse = await fixture.bookingClient.getBooking(bookingId);
    const body = await getResponse.json();
    expect(body.firstname).toBe(partialUpdatePayload.firstname);
    expect(body.lastname).toBe(partialUpdatePayload.lastname);
    expect(body.totalprice).toBe(validBooking.totalprice);
    expect(body.depositpaid).toBe(validBooking.depositpaid);
  });

  test('Auth → Create booking → Full update with PUT → Verify complete replacement', async ({ request }) => {
    const fixture = new ApiFixture(request);
    await fixture.authenticate();

    const createResponse = await fixture.bookingClient.createBooking(validBooking);
    const createBody = await createResponse.json();
    const bookingId = createBody.bookingid;

    const updateResponse = await fixture.bookingClient.updateBooking(bookingId, fullUpdatePayload);
    await assertStatusCode(updateResponse, 200);

    const getResponse = await fixture.bookingClient.getBooking(bookingId);
    const body = await getResponse.json();
    expect(body.firstname).toBe(fullUpdatePayload.firstname);
    expect(body.lastname).toBe(fullUpdatePayload.lastname);
    expect(body.totalprice).toBe(fullUpdatePayload.totalprice);
    expect(body.depositpaid).toBe(fullUpdatePayload.depositpaid);
    expect(body.bookingdates.checkin).toBe(fullUpdatePayload.bookingdates.checkin);
    expect(body.bookingdates.checkout).toBe(fullUpdatePayload.bookingdates.checkout);
    expect(body.additionalneeds).toBe(fullUpdatePayload.additionalneeds);
  });

  test('Auth → Create → Delete → Verify cannot get deleted booking', async ({ request }) => {
    const fixture = new ApiFixture(request);
    await fixture.authenticate();

    const createResponse = await fixture.bookingClient.createBooking(validBooking);
    const createBody = await createResponse.json();
    const bookingId = createBody.bookingid;

    const deleteResponse = await fixture.bookingClient.deleteBooking(bookingId);
    await assertStatusCode(deleteResponse, 201);

    const getResponse = await fixture.bookingClient.getBooking(bookingId);
    await assertStatusCode(getResponse, 404);
  });
});
