function generateBookingPayload(overrides = {}) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const checkout = new Date();
  checkout.setDate(checkout.getDate() + 5);

  const formatDate = (d) => d.toISOString().split('T')[0];

  return {
    firstname: 'John',
    lastname: 'Doe',
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: formatDate(tomorrow),
      checkout: formatDate(checkout),
    },
    additionalneeds: 'Breakfast',
    ...overrides,
    bookingdates: {
      checkin: formatDate(tomorrow),
      checkout: formatDate(checkout),
      ...(overrides.bookingdates || {}),
    },
  };
}

function generatePartialUpdatePayload() {
  return {
    firstname: 'Jane',
    lastname: 'Smith',
  };
}

function generateFullUpdatePayload() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const checkout = new Date();
  checkout.setDate(checkout.getDate() + 7);

  const formatDate = (d) => d.toISOString().split('T')[0];

  return {
    firstname: 'Updated',
    lastname: 'User',
    totalprice: 200,
    depositpaid: false,
    bookingdates: {
      checkin: formatDate(tomorrow),
      checkout: formatDate(checkout),
    },
    additionalneeds: 'Dinner',
  };
}

module.exports = {
  generateBookingPayload,
  generatePartialUpdatePayload,
  generateFullUpdatePayload,
};
