const express = require('express');
const BookshelfController = require('../controllers/BookShelfController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Tambahkan buku ke bookshelf (contoh: 2 untuk "To Read")
router.post('/:shelfId/add', authMiddleware, BookshelfController.addBookToShelf);

// Ambil daftar buku dari bookshelf tertentu
router.get('/:shelfId', authMiddleware, BookshelfController.getBooksFromShelf);

module.exports = router;