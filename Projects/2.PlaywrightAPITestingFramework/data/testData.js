const validBooking = {
  firstname: 'John',
  lastname: 'Doe',
  totalprice: 150,
  depositpaid: true,
  bookingdates: {
    checkin: '2026-06-01',
    checkout: '2026-06-05',
  },
  additionalneeds: 'Breakfast',
};

const bookingWithoutOptionalFields = {
  firstname: 'Alice',
  lastname: 'Smith',
  totalprice: 100,
  depositpaid: false,
  bookingdates: {
    checkin: '2026-07-01',
    checkout: '2026-07-03',
  },
};

const bookingMissingRequired = {
  firstname: 'Bob',
};

const bookingInvalidTotalPrice = {
  firstname: 'Charlie',
  lastname: 'Brown',
  totalprice: 'not-a-number',
  depositpaid: true,
  bookingdates: {
    checkin: '2026-08-01',
    checkout: '2026-08-03',
  },
  additionalneeds: 'Lunch',
};

const bookingInvalidDateFormat = {
  firstname: 'Diana',
  lastname: 'Prince',
  totalprice: 200,
  depositpaid: true,
  bookingdates: {
    checkin: '06-01-2026',
    checkout: '06-05-2026',
  },
  additionalneeds: 'Dinner',
};

const bookingBoundaryMinPrice = {
  firstname: 'MinPrice',
  lastname: 'Test',
  totalprice: 0,
  depositpaid: true,
  bookingdates: {
    checkin: '2026-09-01',
    checkout: '2026-09-02',
  },
  additionalneeds: 'None',
};

const partialUpdatePayload = {
  firstname: 'Jane',
  lastname: 'Smith',
};

const fullUpdatePayload = {
  firstname: 'Updated',
  lastname: 'User',
  totalprice: 200,
  depositpaid: false,
  bookingdates: {
    checkin: '2026-10-10',
    checkout: '2026-10-15',
  },
  additionalneeds: 'Dinner',
};

const authCredentials = {
  valid: {
    username: 'admin',
    password: 'password123',
  },
  invalid: {
    username: 'invalid',
    password: 'wrong',
  },
  empty: {
    username: '',
    password: '',
  },
};

const queryParams = {
  byFirstname: { firstname: 'John' },
  byLastname: { lastname: 'Doe' },
  byCheckin: { checkin: '2026-06-01' },
  byCheckout: { checkout: '2026-06-05' },
  byFirstAndLast: { firstname: 'John', lastname: 'Doe' },
};

module.exports = {
  validBooking,
  bookingWithoutOptionalFields,
  bookingMissingRequired,
  bookingInvalidTotalPrice,
  bookingInvalidDateFormat,
  bookingBoundaryMinPrice,
  partialUpdatePayload,
  fullUpdatePayload,
  authCredentials,
  queryParams,
};
