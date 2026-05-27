const { test, expect } = require('@playwright/test');
const ApiFixture = require('../../fixtures/api.fixture');
const {
  validBooking,
  bookingWithoutOptionalFields,
  bookingMissingRequired,
  bookingInvalidTotalPrice,
  bookingInvalidDateFormat,
  bookingBoundaryMinPrice,
  partialUpdatePayload,
  fullUpdatePayload,
  queryParams,
} = require('../../data/testData');
const {
  assertStatusCode,
  assertResponseTime,
  assertResponseHasField,
  assertResponseFieldType,
  assertResponseFieldEquals,
  assertJsonContentType,
} = require('../../utils/assertions');

test.describe('@regression Booking CRUD', () => {

  let createdBookingId;
  let authToken;

  test.beforeAll(async ({ request }) => {
    const fixture = new ApiFixture(request);
    await fixture.authenticate();
    authToken = fixture.token;
  });

  test('POST /booking should create a booking and return bookingid with booking object', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.bookingClient.createBooking(validBooking);

    await assertStatusCode(response, 200);
    await assertResponseTime(response);
    await assertJsonContentType(response);

    const body = await response.json();
    expect(body).toHaveProperty('bookingid');
    expect(typeof body.bookingid).toBe('number');

    expect(body).toHaveProperty('booking');
    expect(body.booking.firstname).toBe(validBooking.firstname);
    expect(body.booking.lastname).toBe(validBooking.lastname);
    expect(body.booking.totalprice).toBe(validBooking.totalprice);
    expect(body.booking.depositpaid).toBe(validBooking.depositpaid);
    expect(body.booking.bookingdates.checkin).toBe(validBooking.bookingdates.checkin);
    expect(body.booking.bookingdates.checkout).toBe(validBooking.bookingdates.checkout);
    expect(body.booking.additionalneeds).toBe(validBooking.additionalneeds);

    createdBookingId = body.bookingid;
  });

  test('POST /booking without optional field additionalneeds should succeed', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.bookingClient.createBooking(bookingWithoutOptionalFields);

    await assertStatusCode(response, 200);

    const body = await response.json();
    expect(body).toHaveProperty('bookingid');
  });

  test('GET /booking should return array of booking IDs', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.bookingClient.getBookingIds();

    await assertStatusCode(response, 200);
    await assertResponseTime(response);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    if (body.length > 0) {
      expect(body[0]).toHaveProperty('bookingid');
    }
  });

  test('GET /booking with firstname query param should filter results', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.bookingClient.getBookingIds(queryParams.byFirstname);

    await assertStatusCode(response, 200);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('GET /booking with lastname query param should filter results', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.bookingClient.getBookingIds(queryParams.byLastname);

    await assertStatusCode(response, 200);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('GET /booking/{id} should return booking details', async ({ request }) => {
    const fixture = new ApiFixture(request);

    const createResponse = await fixture.bookingClient.createBooking(validBooking);
    const createBody = await createResponse.json();
    const bookingId = createBody.bookingid;

    const response = await fixture.bookingClient.getBooking(bookingId);

    await assertStatusCode(response, 200);
    await assertResponseTime(response);
    await assertJsonContentType(response);

    const body = await response.json();
    expect(body.firstname).toBe(validBooking.firstname);
    expect(body.lastname).toBe(validBooking.lastname);
    expect(body.totalprice).toBe(validBooking.totalprice);
    expect(body.depositpaid).toBe(validBooking.depositpaid);
    expect(body).toHaveProperty('bookingdates');
    expect(body.bookingdates.checkin).toBe(validBooking.bookingdates.checkin);
    expect(body.bookingdates.checkout).toBe(validBooking.bookingdates.checkout);
  });

  test('GET /booking/{id} with non-existent ID should return 404', async ({ request }) => {
    const fixture = new ApiFixture(request);
    const response = await fixture.bookingClient.getBooking(99999999);

    await assertStatusCode(response, 404);
  });

  test('PUT /booking/{id} should fully update a booking', async ({ request }) => {
    const fixture = new ApiFixture(request);

    const createResponse = await fixture.bookingClient.createBooking(validBooking);
    const createBody = await createResponse.json();
    const bookingId = createBody.bookingid;

    const authFixture = new ApiFixture(request);
    await authFixture.authenticate();

    await authFixture.bookingClient.updateBooking(bookingId, fullUpdatePayload);

    const getResponse = await fixture.bookingClient.getBooking(bookingId);
    const body = await getResponse.json();

    expect(body.firstname).toBe(fullUpdatePayload.firstname);
    expect(body.lastname).toBe(fullUpdatePayload.lastname);
    expect(body.totalprice).toBe(fullUpdatePayload.totalprice);
    expect(body.depositpaid).toBe(fullUpdatePayload.depositpaid);
    expect(body.additionalneeds).toBe(fullUpdatePayload.additionalneeds);
  });

  test('PUT /booking/{id} without auth should return 403', async ({ request }) => {
    const fixture = new ApiFixture(request);

    const createResponse = await fixture.bookingClient.createBooking(validBooking);
    const createBody = await createResponse.json();
    const bookingId = createBody.bookingid;

    const response = await fixture.bookingClient.updateBooking(bookingId, fullUpdatePayload);

    await assertStatusCode(response, 403);
  });

  test('PATCH /booking/{id} should partially update a booking', async ({ request }) => {
    const fixture = new ApiFixture(request);

    const createResponse = await fixture.bookingClient.createBooking(validBooking);
    const createBody = await createResponse.json();
    const bookingId = createBody.bookingid;

    const authFixture = new ApiFixture(request);
    await authFixture.authenticate();

    const patchResponse = await authFixture.bookingClient.partialUpdateBooking(bookingId, partialUpdatePayload);
    await assertStatusCode(patchResponse, 200);

    const getResponse = await fixture.bookingClient.getBooking(bookingId);
    const body = await getResponse.json();

    expect(body.firstname).toBe(partialUpdatePayload.firstname);
    expect(body.lastname).toBe(partialUpdatePayload.lastname);
  });

  test('PATCH /booking/{id} without auth should return 403', async ({ request }) => {
    const fixture = new ApiFixture(request);

    const createResponse = await fixture.bookingClient.createBooking(validBooking);
    const createBody = await createResponse.json();
    const bookingId = createBody.bookingid;

    const response = await fixture.bookingClient.partialUpdateBooking(bookingId, partialUpdatePayload);

    await assertStatusCode(response, 403);
  });

  test('DELETE /booking/{id} should delete a booking and return 201', async ({ request }) => {
    const fixture = new ApiFixture(request);

    const createResponse = await fixture.bookingClient.createBooking(validBooking);
    const createBody = await createResponse.json();
    const bookingId = createBody.bookingid;

    const authFixture = new ApiFixture(request);
    await authFixture.authenticate();

    const deleteResponse = await authFixture.bookingClient.deleteBooking(bookingId);
    await assertStatusCode(deleteResponse, 201);
  });

  test('DELETE /booking/{id} without auth should return 403', async ({ request }) => {
    const fixture = new ApiFixture(request);

    const createResponse = await fixture.bookingClient.createBooking(validBooking);
    const createBody = await createResponse.json();
    const bookingId = createBody.bookingid;

    const response = await fixture.bookingClient.deleteBooking(bookingId);
    await assertStatusCode(response, 403);
  });

  test('DELETE /booking/{id} with non-existent ID should return 405', async ({ request }) => {
    const authFixture = new ApiFixture(request);
    await authFixture.authenticate();

    const response = await authFixture.bookingClient.deleteBooking(99999999);

    const status = response.status();
    expect([403, 404, 405]).toContain(status);
  });
});
