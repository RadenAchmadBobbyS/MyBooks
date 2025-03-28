jest.mock('../models', () => ({
  Purchase: {
    findOne: jest.fn(),
  },
  Book: {},
  User: {},
}));

const { Purchase } = require('../models');
const transactionController = require('../controllers/transactionController');
const httpMocks = require('node-mocks-http');

describe('Transaction Controller', () => {
  it('should have a function to handle transaction-related tasks', () => {
    expect(typeof transactionController.someFunction).toBe('function');
  });

  // Add more specific tests for transactionController here
});

describe('Transaction Controller Tests', () => {
  it('should return a transaction by ID', async () => {
    const req = httpMocks.createRequest({
      params: { id: '1' },
      user: { id: 1 },
    });
    const res = httpMocks.createResponse();

    Purchase.findOne = jest.fn().mockImplementation(({ where }) => {
      if (where.id === '1' && where.userId === 1) {
        return Promise.resolve({
          id: 1,
          Book: { id: 1, title: 'Book 1', author: 'Author 1', price: 100 },
        });
      }
      return Promise.resolve(null);
    });

    await transactionController.getTransactionById(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      id: 1,
      Book: { id: 1, title: 'Book 1', author: 'Author 1', price: 100 },
    });
  });

  it('should return 404 if transaction is not found', async () => {
    const req = httpMocks.createRequest({
      params: { id: '999' },
      user: { id: 1 },
    });
    const res = httpMocks.createResponse();

    Purchase.findOne = jest.fn().mockImplementation(({ where }) => {
      if (where.id === '1' && where.userId === 1) {
        return Promise.resolve({
          id: 1,
          Book: { id: 1, title: 'Book 1', author: 'Author 1', price: 100 },
        });
      }
      return Promise.resolve(null);
    });

    await transactionController.getTransactionById(req, res);

    expect(res.statusCode).toBe(404);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Transaction not found' });
  });
});