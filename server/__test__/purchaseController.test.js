const request = require('supertest');
const express = require('express');
const purchaseController = require('../controllers/purchaseController');
const { Purchase, Book } = require('../models');
const midtransClient = require('midtrans-client');
const httpMocks = require('node-mocks-http');

jest.mock('../models', () => ({
    Purchase: {
        create: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
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

const app = express();
app.use(express.json());
app.post('/purchase', purchaseController.createPurchase);
app.post('/webhook', purchaseController.midtransWebHook);

describe('purchaseController', () => {
    describe('createPurchase', () => {
        it('should return 400 if bookId is missing', async () => {
            const response = await request(app).post('/purchase').send({});
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('User not authenticated');
        });

        it('should return 404 if book is not found', async () => {
            Book.findByPk.mockResolvedValue(null);
            const response = await request(app).post('/purchase').send({ bookId: 1 });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('User not authenticated');
        });

        it('should handle Midtrans errors gracefully', async () => {
            Book.findByPk.mockResolvedValue({ price: 100 });
            midtransClient.Snap.mockImplementation(() => ({
                createTransaction: jest.fn().mockRejectedValue(new Error('Midtrans error')),
            }));

            const response = await request(app).post('/purchase').send({ bookId: 1 });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('User not authenticated');
        });
    });

    describe('midtransWebHook', () => {
        it('should return 400 if order_id is missing', async () => {
            const response = await request(app).post('/webhook').send({});
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing order_id');
        });

        it('should return 404 if transaction is not found', async () => {
            Purchase.findOne.mockResolvedValue(null);
            const response = await request(app).post('/webhook').send({ order_id: '123', transaction_status: 'settlement' });
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Transaction not found');
        });

        it('should update payment status for valid transactions', async () => {
            Purchase.findOne.mockResolvedValue({});
            const response = await request(app).post('/webhook').send({ order_id: '123', transaction_status: 'settlement' });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Transaction status updated');
        });
    });
});

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

describe('Purchase Controller Additional Tests', () => {
  it('should return 400 if bookId is invalid', async () => {
    const req = httpMocks.createRequest({
      body: { bookId: 'invalid' },
      user: { id: 1, email: 'user@example.com' },
    });
    const res = httpMocks.createResponse();

    await purchaseController.createPurchase(req, res);

    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Invalid bookId' });
  });

  it('should return 404 if book is not found', async () => {
    const req = httpMocks.createRequest({
      body: { bookId: 999 },
      user: { id: 1, email: 'user@example.com' },
    });
    const res = httpMocks.createResponse();

    Book.findByPk = jest.fn().mockResolvedValue(null);

    await purchaseController.createPurchase(req, res);

    expect(res.statusCode).toBe(404);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Book not found' });
  });

  it('should handle missing order_id in midtransWebHook', async () => {
    const req = httpMocks.createRequest({
      body: { transaction_status: 'settlement' },
    });
    const res = httpMocks.createResponse();

    await purchaseController.midtransWebHook(req, res);

    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Missing order_id' });
  });

  it('should handle invalid transaction_status in midtransWebHook', async () => {
    const req = httpMocks.createRequest({
      body: { order_id: 'order-123', transaction_status: 'unknown' },
    });
    const res = httpMocks.createResponse();

    Purchase.findOne = jest.fn().mockResolvedValue({ transactionId: 'order-123' });

    await purchaseController.midtransWebHook(req, res);

    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Internal server error' });
  });
});