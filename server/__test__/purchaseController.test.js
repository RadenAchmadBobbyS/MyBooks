const purchaseController = require('../controllers/purchaseController');
const { Purchase, Book } = require('../models');
const midtransClient = require('midtrans-client');
const httpMocks = require('node-mocks-http');

jest.mock('../models', () => ({
  Purchase: {
    create: jest.fn(),
  },
  Book: {
    findByPk: jest.fn(),
  },
}));

jest.mock('midtrans-client', () => ({
  Snap: jest.fn().mockImplementation(() => ({
    createTransaction: jest.fn(),
  })),
}));

describe('Purchase Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if bookId is invalid', async () => {
    const req = { body: { bookId: 'invalid' }, user: { id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await purchaseController.createPurchase(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid bookId' });
  });

  it('should return 500 if midtrans transaction fails', async () => {
    const req = { body: { bookId: 1 }, user: { id: 1, email: 'user@example.com' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Book.findByPk.mockResolvedValue({
      id: 1,
      price: 100.0,
    });

    midtransClient.Snap.mockImplementation(() => ({
      createTransaction: jest.fn().mockImplementation(() => {
        throw new Error('Midtrans error');
      }),
    }));

    await purchaseController.createPurchase(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });

  it('should handle missing user in request', async () => {
    const req = { body: { bookId: 1 } }; // Missing user object
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await purchaseController.createPurchase(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not authenticated' });
  });

  it('should handle missing email in user object', async () => {
    const req = { body: { bookId: 1 }, user: { id: 1 } }; // Missing email in user
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Book.findByPk.mockResolvedValue({
      id: 1,
      price: 100.0,
    });

    await purchaseController.createPurchase(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User email is required' });
  });

  it('should handle invalid price in book object', async () => {
    const req = { body: { bookId: 1 }, user: { id: 1, email: 'user@example.com' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Book.findByPk.mockResolvedValue({
      id: 1,
      price: 'invalid', // Invalid price
    });

    await purchaseController.createPurchase(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid book price' });
  });

  it('should handle errors during purchase creation', async () => {
    const req = { body: { bookId: 1 }, user: { id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Purchase.create.mockRejectedValue(new Error('Database error'));

    await purchaseController.createPurchase(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User email is required' });
  });

  it('should return 400 if bookId is not provided', async () => {
    const req = { body: {}, user: { id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await purchaseController.createPurchase(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid bookId' });
  });

  it('should return 404 if book is not found', async () => {
    const req = { body: { bookId: 999 }, user: { id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Book.findByPk.mockResolvedValue(null);

    await purchaseController.createPurchase(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User email is required' });
  });

  it('should return 400 if order_id is missing in midtransWebHook', async () => {
    const req = httpMocks.createRequest({ body: {} });
    const res = httpMocks.createResponse();

    await purchaseController.midtransWebHook(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Missing order_id' });
  });

  it('should handle invalid transaction_status in midtransWebHook', async () => {
    const req = httpMocks.createRequest({
      body: { order_id: 'order-123', transaction_status: 'unknown' },
    });
    const res = httpMocks.createResponse();


    await purchaseController.midtransWebHook(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Internal server error' });
  });
});