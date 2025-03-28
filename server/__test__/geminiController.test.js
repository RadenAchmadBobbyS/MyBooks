const geminiController = require('../controllers/geminiController');
const httpMocks = require('node-mocks-http');
const generateText = require('../helpers/geminiAI');
const { Book } = require('../models')

jest.mock('../helpers/geminiAI'); // Mock the generateText module

describe('Gemini Controller', () => {
  it('should have a function to handle gemini-related tasks', () => {
    expect(typeof geminiController.someFunction).toBe('function');
  });

  // Add more specific tests for geminiController here
});

describe('Gemini Controller Additional Tests', () => {
  it('should generate a response for a valid prompt', async () => {
    const req = httpMocks.createRequest({
      body: { prompt: 'Apa itu AI?' },
    });
    const res = httpMocks.createResponse();

    generateText.mockResolvedValue('AI adalah kecerdasan buatan.');

    await geminiController.generateRespons(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ response: 'AI adalah kecerdasan buatan.' });
  });

  it('should return book recommendations for a specific prompt', async () => {
    const req = httpMocks.createRequest({
      body: { prompt: 'rekomendasi buku' },
    });
    const res = httpMocks.createResponse();

    Book.findAll = jest.fn().mockResolvedValue([
      { title: 'Book 1', author: 'Author 1' },
      { title: 'Book 2', author: 'Author 2' },
    ]);

    await geminiController.generateRespons(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      response: 'Berikut beberapa rekomendasi buku:\n\n1. Book 1 - Author 1\n2. Book 2 - Author 2',
    });
  });

  it('should handle invalid prompt gracefully', async () => {
    const req = httpMocks.createRequest({
      body: { prompt: '' },
    });
    const res = httpMocks.createResponse();

    await geminiController.generateRespons(req, res);

    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Prompt cannot be empty' });
  });

  it('should search for books based on a query', async () => {
    const req = httpMocks.createRequest({
      body: { prompt: 'cari buku Harry Potter' },
    });
    const res = httpMocks.createResponse();

    Book.findAll = jest.fn().mockResolvedValue([
      { title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling' },
    ]);

    await geminiController.generateRespons(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      response: 'Buku yang ditemukan:\n\n1. Harry Potter and the Sorcerer\'s Stone - J.K. Rowling',
    });
  });

  it('should handle no books found for a query', async () => {
    const req = httpMocks.createRequest({
      body: { prompt: 'cari buku Unknown Title' },
    });
    const res = httpMocks.createResponse();

    Book.findAll = jest.fn().mockResolvedValue([]);

    await geminiController.generateRespons(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      response: 'Maaf, buku berjudul \"Unknown Title\" tidak ditemukan di database.',
    });
  });

  it('should handle unexpected errors gracefully', async () => {
    const req = httpMocks.createRequest({
      body: { prompt: 'cari buku Error' },
    });
    const res = httpMocks.createResponse();

    Book.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

    await geminiController.generateRespons(req, res);

    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Internal server error' });
  });
});