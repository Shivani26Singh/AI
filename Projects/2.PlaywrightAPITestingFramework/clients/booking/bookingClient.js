const ApiClient = require('../base/apiClient');

class BookingClient extends ApiClient {
  constructor(request, token) {
    super(request);
    this.endpoint = '/booking';
    this.token = token;
  }

  _authHeaders() {
    if (!this.token) return {};
    return {
      Cookie: `token=${this.token}`,
    };
  }

  async getBookingIds(queryParams = {}) {
    const searchParams = new URLSearchParams();
    if (queryParams.firstname) searchParams.set('firstname', queryParams.firstname);
    if (queryParams.lastname) searchParams.set('lastname', queryParams.lastname);
    if (queryParams.checkin) searchParams.set('checkin', queryParams.checkin);
    if (queryParams.checkout) searchParams.set('checkout', queryParams.checkout);

    const queryString = searchParams.toString();
    const path = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;

    const response = await this.get(path);
    return response;
  }

  async getBooking(id) {
    const response = await this.get(`${this.endpoint}/${id}`);
    return response;
  }

  async createBooking(bookingData) {
    const response = await this.post(this.endpoint, bookingData);
    return response;
  }

  async updateBooking(id, bookingData) {
    const response = await this.put(`${this.endpoint}/${id}`, bookingData, {
      headers: this._authHeaders(),
    });
    return response;
  }

  async partialUpdateBooking(id, bookingData) {
    const response = await this.patch(`${this.endpoint}/${id}`, bookingData, {
      headers: this._authHeaders(),
    });
    return response;
  }

  async deleteBooking(id) {
    const response = await this.delete(`${this.endpoint}/${id}`, {
      headers: this._authHeaders(),
    });
    return response;
  }
}

module.exports = BookingClient;
