require('dotenv').config(); 

const userController = require('../controllers/userController');
const { User, Purchase } = require('../models');
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');

jest.mock('../models', () => ({
  User: {
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  },
  Purchase: {
    findAll: jest.fn(),
  },
}));

jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    verifyIdToken: jest.fn().mockResolvedValue({
      getPayload: () => ({
        sub: '123',
        name: 'John Doe',
        email: 'john@example.com',
      }),
    }),
  })),
}));

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle Google login successfully', async () => {
    jest.setTimeout(10000); // Increase timeout to 10 seconds

    const req = httpMocks.createRequest({
      body: { tokenId: 'valid-token-id' },
    });
    const res = httpMocks.createResponse();

    const mockPayload = { sub: '123', name: 'John Doe', email: 'john@example.com' };
    const mockToken = 'mock-jwt-token';

    jest.spyOn(jwt, 'sign').mockReturnValue(mockToken);
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ id: 1, ...mockPayload, role: 'user' });

    const mockClient = {
      verifyIdToken: jest.fn().mockResolvedValue({ getPayload: () => mockPayload }),
    };
    jest.spyOn(require('google-auth-library'), 'OAuth2Client').mockImplementation(() => mockClient);

    await userController.googleLogin(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      user: { id: 1, ...mockPayload, role: 'user' },
      token: mockToken,
    });
  });

  it('should handle errors during Google login', async () => {
    const req = httpMocks.createRequest({
      body: { tokenId: 'invalid-token-id' },
    });
    const res = httpMocks.createResponse();

    const mockClient = {
      verifyIdToken: jest.fn().mockRejectedValue(new Error('Invalid token')),
    };
    jest.spyOn(require('google-auth-library'), 'OAuth2Client').mockImplementation(() => mockClient);

    await userController.googleLogin(req, res);

    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Internal server error' });
  });

  it('should fetch user profile successfully', async () => {
    const req = httpMocks.createRequest({ user: { id: 1 } });
    const res = httpMocks.createResponse();

    User.findByPk.mockResolvedValue({ id: 1, name: 'John Doe', email: 'john@example.com' });

    await userController.getUserProfile(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ id: 1, name: 'John Doe', email: 'john@example.com' });
  });

  it('should handle errors during fetching user profile', async () => {
    const req = httpMocks.createRequest({ user: { id: 1 } });
    const res = httpMocks.createResponse();

    User.findByPk.mockRejectedValue(new Error('Database error'));

    await userController.getUserProfile(req, res);

    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Internal server error' });
  });

  it('should update user profile successfully', async () => {
    const req = httpMocks.createRequest({
      user: { id: 1 },
      body: { name: 'Updated Name' },
    });
    const res = httpMocks.createResponse();

    User.findByPk.mockResolvedValue({ id: 1, name: 'Old Name', save: jest.fn().mockResolvedValue() });

    await userController.updateUserProfile(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Profile updated',
      user: { id: 1, name: 'Updated Name' },
    });
  });

  it('should handle errors during updating user profile', async () => {
    const req = httpMocks.createRequest({
      user: { id: 1 },
      body: { name: 'Updated Name' },
    });
    const res = httpMocks.createResponse();

    User.findByPk.mockRejectedValue(new Error('Database error'));

    await userController.updateUserProfile(req, res);

    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Internal server error' });
  });

  it('should fetch user purchases successfully', async () => {
    const req = httpMocks.createRequest({ user: { id: 1 } });
    const res = httpMocks.createResponse();

    Purchase.findAll.mockResolvedValue([{ id: 1, bookId: 1, userId: 1 }]);

    await userController.getUserPurchase(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual([{ id: 1, bookId: 1, userId: 1 }]);
  });

  it('should handle errors during fetching user purchases', async () => {
    const req = httpMocks.createRequest({ user: { id: 1 } });
    const res = httpMocks.createResponse();

    Purchase.findAll.mockRejectedValue(new Error('Database error'));

    await userController.getUserPurchase(req, res);

    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Internal server error' });
  });

  it('should handle logout successfully', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    userController.logout(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Loggout susscess' });
  });
});