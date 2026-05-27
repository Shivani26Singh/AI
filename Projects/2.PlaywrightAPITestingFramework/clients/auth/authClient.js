const ApiClient = require('../base/apiClient');

class AuthClient extends ApiClient {
  constructor(request) {
    super(request);
    this.endpoint = '/auth';
  }

  async createToken(username, password) {
    const response = await this.post(this.endpoint, {
      username,
      password,
    });
    return response;
  }
}

module.exports = AuthClient;
