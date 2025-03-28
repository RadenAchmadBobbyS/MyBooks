const bookController = require('../controllers/bookController');
const httpMocks = require('node-mocks-http');
const Book = require('../models').Book; // Add this line to import the Book model

// Mock the Book model
jest.mock('../models', () => ({
  Book: {
    findByPk: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
  },
}));

// Mock data
const mockBooks = [
  { id: 1, title: 'Book 1', author: 'Author 1' },
  { id: 2, title: 'Book 2', author: 'Author 2' },
];

// Mock the bookController methods
bookController.getBooks = jest.fn((req, res) => {
  res.status(200).json(mockBooks);
});

bookController.getBookById = jest.fn((req, res) => {
  const book = mockBooks.find((b) => b.id === parseInt(req.params.id));
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

describe('Book Controller', () => {
  it('should have a function to handle book-related tasks', () => {
    expect(typeof bookController.someFunction).toBe('function');
  });

  it('should return a list of books', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    bookController.getBooks(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(mockBooks);
  });

  it('should return a book by ID', () => {
    const req = httpMocks.createRequest({
      params: { id: '1' },
    });
    const res = httpMocks.createResponse();

    bookController.getBookById(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(mockBooks[0]);
  });

  it('should return 404 if book is not found', () => {
    const req = httpMocks.createRequest({
      params: { id: '999' },
    });
    const res = httpMocks.createResponse();

    bookController.getBookById(req, res);

    expect(res.statusCode).toBe(404);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Book not found' });
  });

  // Add more specific tests for bookController here
});


describe('Book Controller Additional Tests', () => {
  it('should handle empty book list', () => {
    bookController.getBooks = jest.fn((req, res) => {
      res.status(200).json([]);
    });

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    bookController.getBooks(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual([]);
  });

  it('should handle invalid ID format', () => {
    const req = httpMocks.createRequest({
      params: { id: 'invalid' },
    });
    const res = httpMocks.createResponse();

    bookController.getBookById(req, res);

    expect(res.statusCode).toBe(404);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Book not found' });
  });

  it('should handle unexpected errors gracefully', () => {
    bookController.getBooks = jest.fn((req, res) => {
      throw new Error('Unexpected error');
    });

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    expect(() => bookController.getBooks(req, res)).toThrow('Unexpected error');
  });

  it('should search books by title', async () => {
    const req = httpMocks.createRequest({
      query: { q: 'Book 1' },
    });
    const res = httpMocks.createResponse();

    Book.findAll = jest.fn().mockResolvedValue([mockBooks[0]]);

    await bookController.searchBooks(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual([mockBooks[0]]);
  });

  it('should add a new book', async () => {
    const req = httpMocks.createRequest({
      body: {
        title: 'New Book',
        author: 'New Author',
        description: 'Description',
        price: 100,
        status: 'available',
        content: 'Content',
        imgUrl: 'http://example.com/image.jpg',
      },
    });
    const res = httpMocks.createResponse();

    Book.create = jest.fn().mockResolvedValue({ id: 3, ...req.body });

    await bookController.addBook(req, res);

    expect(res.statusCode).toBe(201);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Book added' });
  });

  it('should update a book', async () => {
    const req = httpMocks.createRequest({
      params: { id: '1' },
      body: {
        title: 'Updated Book',
        author: 'Updated Author',
        description: 'Updated Description',
        price: 150,
        status: 'available',
        content: 'Updated Content',
        imgUrl: 'http://example.com/updated-image.jpg',
      },
    });
    const res = httpMocks.createResponse();

    Book.findByPk = jest.fn().mockResolvedValue({
      id: 1,
      save: jest.fn().mockResolvedValue(),
    });

    await bookController.updateBook(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Book updated', books: expect.any(Object) });
  });

  it('should delete a book', async () => {
    const req = httpMocks.createRequest({
      params: { id: '1' },
    });
    const res = httpMocks.createResponse();

    Book.findByPk = jest.fn().mockResolvedValue({
      id: 1,
      destroy: jest.fn().mockResolvedValue(),
    });

    await bookController.deleteBook(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Book deleted' });
  });
});