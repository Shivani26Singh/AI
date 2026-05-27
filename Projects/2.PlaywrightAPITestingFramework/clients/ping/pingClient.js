const ApiClient = require('../base/apiClient');

class PingClient extends ApiClient {
  constructor(request) {
    super(request);
    this.endpoint = '/ping';
  }

  async healthCheck() {
    const response = await this.get(this.endpoint);
    return response;
  }
}

module.exports = PingClient;
