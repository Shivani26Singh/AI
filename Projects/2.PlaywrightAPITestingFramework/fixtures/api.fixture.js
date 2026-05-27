const config = require('../config/config');
const AuthClient = require('../clients/auth/authClient');
const BookingClient = require('../clients/booking/bookingClient');
const PingClient = require('../clients/ping/pingClient');

class ApiFixture {
  constructor(request) {
    this.request = request;
    this.authClient = new AuthClient(request);
    this.pingClient = new PingClient(request);
    this._bookingClient = null;
    this._token = null;
  }

  async authenticate() {
    const response = await this.authClient.createToken(
      config.auth.username,
      config.auth.password
    );
    const body = await response.json();
    this._token = body.token;
    this._bookingClient = new BookingClient(this.request, this._token);
    return this._token;
  }

  get token() {
    return this._token;
  }

  get bookingClient() {
    if (!this._bookingClient) {
      this._bookingClient = new BookingClient(this.request, null);
    }
    return this._bookingClient;
  }
}

module.exports = ApiFixture;
