const { expect } = require('@playwright/test');
const config = require('../../config/config');

class ApiClient {
  constructor(request) {
    this.request = request;
    this.baseURL = config.baseURL;
  }

  buildUrl(path) {
    return `${this.baseURL}${path}`;
  }

  async get(path, options = {}) {
    const startTime = Date.now();
    const response = await this.request.get(this.buildUrl(path), options);
    const responseTime = Date.now() - startTime;
    response._responseTime = responseTime;
    return response;
  }

  async post(path, data, options = {}) {
    const startTime = Date.now();
    const response = await this.request.post(this.buildUrl(path), {
      data,
      ...options,
    });
    const responseTime = Date.now() - startTime;
    response._responseTime = responseTime;
    return response;
  }

  async put(path, data, options = {}) {
    const startTime = Date.now();
    const response = await this.request.put(this.buildUrl(path), {
      data,
      ...options,
    });
    const responseTime = Date.now() - startTime;
    response._responseTime = responseTime;
    return response;
  }

  async patch(path, data, options = {}) {
    const startTime = Date.now();
    const response = await this.request.patch(this.buildUrl(path), {
      data,
      ...options,
    });
    const responseTime = Date.now() - startTime;
    response._responseTime = responseTime;
    return response;
  }

  async delete(path, options = {}) {
    const startTime = Date.now();
    const response = await this.request.delete(this.buildUrl(path), options);
    const responseTime = Date.now() - startTime;
    response._responseTime = responseTime;
    return response;
  }

  async assertStatus(response, expectedStatus) {
    expect(response.status()).toBe(expectedStatus);
  }

  async assertResponseTime(response, maxMs) {
    expect(response._responseTime).toBeLessThan(maxMs || config.responseTimeThreshold);
  }

  async assertJsonContentType(response) {
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  }
}

module.exports = ApiClient;
