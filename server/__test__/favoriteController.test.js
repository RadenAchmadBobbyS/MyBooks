const favoriteController = require('../controllers/favoriteController');
const httpMocks = require('node-mocks-http');
const { Favorite, Book, Purchase } = require('../models')

describe('Favorite Controller', () => {
  it('should have a function to handle favorite-related tasks', () => {
    expect(typeof favoriteController.someFunction).toBe('function');
  });

  // Add more specific tests for favoriteController here
});

describe('Favorite Controller Additional Tests', () => {
  it('should add a book to favorites', async () => {
    const req = httpMocks.createRequest({
      body: { bookId: 1 },
      user: { id: 1 },
    });
    const res = httpMocks.createResponse();

    Book.findByPk = jest.fn().mockResolvedValue({ id: 1, price: 0 });
    Purchase.findOne = jest.fn().mockResolvedValue(null);
    Favorite.findOne = jest.fn().mockResolvedValue(null);
    Favorite.create = jest.fn().mockResolvedValue({ userId: 1, bookId: 1 });

    await favoriteController.addToFavorite(req, res);

    expect(res.statusCode).toBe(201);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Book added to favorites' });
  });

  it('should return 404 if book is not found when adding to favorites', async () => {
    const req = httpMocks.createRequest({
      body: { bookId: 999 },
      user: { id: 1 },
    });
    const res = httpMocks.createResponse();

    Book.findByPk = jest.fn().mockResolvedValue(null);

    await favoriteController.addToFavorite(req, res);

    expect(res.statusCode).toBe(404);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Book not found' });
  });

  it('should return all favorites for a user', async () => {
    const req = httpMocks.createRequest({ user: { id: 1 } });
    const res = httpMocks.createResponse();

    Favorite.findAll = jest.fn().mockResolvedValue([
      { bookId: 1, Book: { id: 1, title: 'Book 1', author: 'Author 1', price: 0, imgUrl: 'url' } },
    ]);

    await favoriteController.getFavorite(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual([
      { bookId: 1, Book: { id: 1, title: 'Book 1', author: 'Author 1', price: 0, imgUrl: 'url' } },
    ]);
  });
});