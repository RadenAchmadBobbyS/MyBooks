const request = require('supertest');
const app = require('../app');

describe('App.js Tests', () => {
  it('should return a welcome message on GET /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Hello Hoyyy' });
  });

  it('should load environment variables in non-production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    jest.resetModules();
    require('../app');
    process.env.NODE_ENV = originalEnv;
  });

  it('should not load environment variables in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    jest.resetModules();
    require('../app');
    process.env.NODE_ENV = originalEnv;
  });
});