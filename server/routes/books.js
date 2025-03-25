const express = require("express");
const BookController = require("../controllers/booksController");

const router = express.Router();

router.get("/search", BookController.searchBooks);
router.get("/my-library", BookController.getMyLibrary);
router.get("/all-books", BookController.getAllBooks);

module.exports = router;