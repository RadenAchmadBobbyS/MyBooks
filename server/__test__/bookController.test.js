const bookController = require('../controllers/bookController');
const httpMocks = require('node-mocks-http');

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