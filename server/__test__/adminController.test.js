const adminController = require('../controllers/adminController');
const { Purchase, User, Book } = require('../models');
const httpMocks = require('node-mocks-http');

jest.mock('../models');

describe('Admin Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all user transactions', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    Purchase.findAll.mockResolvedValue([{ id: 1, paymentDate: '2023-01-01' }]);

    await adminController.getUserTransaction(req, res);

    expect(Purchase.findAll).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual([{ id: 1, paymentDate: '2023-01-01' }]);
  });

  it('should handle errors in getUserTransaction', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    Purchase.findAll.mockRejectedValue(new Error('Database error'));

    await adminController.getUserTransaction(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Internal server error' });
  });

  it('should fetch a user transaction by ID', async () => {
    const req = httpMocks.createRequest({ user: { id: 1 } });
    const res = httpMocks.createResponse();

    Purchase.findOne.mockResolvedValue({ id: 1 });

    await adminController.getUserTransactionById(req, res);

    expect(Purchase.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      include: expect.any(Array),
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ id: 1 });
  });

  it('should handle not found in getUserTransactionById', async () => {
    const req = httpMocks.createRequest({ user: { id: 1 } });
    const res = httpMocks.createResponse();

    Purchase.findOne.mockResolvedValue(null);

    await adminController.getUserTransactionById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: 'transactions not found' });
  });

  it('should fetch all users', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    User.findAll.mockResolvedValue([{ id: 1, name: 'John Doe' }]);

    await adminController.getAllusers(req, res);

    expect(User.findAll).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual([{ id: 1, name: 'John Doe' }]);
  });

  it('should handle empty user list in getAllusers', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    User.findAll.mockResolvedValue([]);

    await adminController.getAllusers(req, res);

    expect(User.findAll).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual([]);
  });

  it('should update a user role', async () => {
    const req = httpMocks.createRequest({
      params: { id: 1 },
      body: { role: 'admin' },
    });
    const res = httpMocks.createResponse();

    User.findByPk.mockResolvedValue({ id: 1, save: jest.fn().mockResolvedValue(), role: 'user' });

    await adminController.updateUserRole(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'User 1 role updated successfully' });
  });

  it('should return 404 if user is not found when updating role', async () => {
    const req = httpMocks.createRequest({
      params: { id: 999 },
      body: { role: 'admin' },
    });
    const res = httpMocks.createResponse();

    User.findByPk.mockResolvedValue(null);

    await adminController.updateUserRole(req, res);

    expect(res.statusCode).toBe(404);
  });

  it('should return 400 if role is missing when updating user role', async () => {
    const req = httpMocks.createRequest({
      params: { id: 1 },
      body: {},
    });
    const res = httpMocks.createResponse();

    User.findByPk.mockResolvedValue({ id: 1, save: jest.fn().mockResolvedValue(), role: 'user' });

    await adminController.updateUserRole(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Role is required' });
  });

  it('should handle missing role in updateUserRole', async () => {
    const req = httpMocks.createRequest({
      params: { id: 1 },
      body: {},
    });
    const res = httpMocks.createResponse();

    User.findByPk.mockResolvedValue({ save: jest.fn(), role: 'user' });

    await adminController.updateUserRole(req, res);

    expect(res.statusCode).toBe(400); // Updated to expect 400
    expect(res._getJSONData()).toEqual({ message: 'Role is required' }); // Updated expected message
  });

  it('should delete a user', async () => {
    const req = httpMocks.createRequest({ params: { id: 1 } });
    const res = httpMocks.createResponse();

    User.findByPk.mockResolvedValue({ name: 'John Doe' });
    User.destroy.mockResolvedValue(1);

    await adminController.deleteUser(req, res);

    expect(User.findByPk).toHaveBeenCalledWith(1);
    expect(User.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'user John Doe success deleted' });
  });

  it('should return 404 if user is not found when deleting', async () => {
    const req = httpMocks.createRequest({ params: { id: 999 } });
    const res = httpMocks.createResponse();

    User.findByPk.mockResolvedValue(null);

    await adminController.deleteUser(req, res);

    expect(User.findByPk).toHaveBeenCalledWith(999);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: 'User 999 not found' });
  });

  it('should handle empty transactions in getUserTransaction', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    Purchase.findAll.mockResolvedValue([]);

    await adminController.getUserTransaction(req, res);

    expect(Purchase.findAll).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual([]);
  });
});

describe('Admin Controller Additional Tests', () => {
  it('should return 404 if user is not found when updating role', async () => {
    const req = httpMocks.createRequest({
      params: { id: 999 },
      body: { role: 'admin' },
    });
    const res = httpMocks.createResponse();

    User.findByPk.mockResolvedValue(null);

    await adminController.updateUserRole(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: 'User 999 not found' });
  });

  it('should return 400 if role is missing when updating user role', async () => {
    const req = httpMocks.createRequest({
      params: { id: 1 },
      body: {},
    });
    const res = httpMocks.createResponse();

    User.findByPk.mockResolvedValue({ id: 1, save: jest.fn().mockResolvedValue(), role: 'user' });

    await adminController.updateUserRole(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Role is required' });
  });

  it('should return 404 if user is not found when deleting', async () => {
    const req = httpMocks.createRequest({ params: { id: 999 } });
    const res = httpMocks.createResponse();

    User.findByPk.mockResolvedValue(null);

    await adminController.deleteUser(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: 'User 999 not found' });
  });
});