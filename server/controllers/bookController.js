const { Op } = require('sequelize');
const { Book } = require('../models')

class bookController {
    // user get books, books-detail, search-books
    static async getAllBooks(req, res) {
        try {
            const books = await Book.findAll();
            res.status(200).json(books);
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    static async getBookById(req, res) {
        try {
            const id = req.params.id
            const book = await Book.findByPk(id)

            if (!book) return res.status(404).json({ message: 'Book not found' });
            res.status(200).json(book);
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    static async searchBooks(req, res) {
        try {
            const { q, author } = req.query;
            const option = {};

            if (q) {
                option.title = {
                    [Op.iLike]: `%${q}%`
                }
            }

            if (author) {
                option.author = {
                    [Op.iLike]: `%${author}%`
                }
            }

            const book = await Book.findAll({ where: option });
            res.status(200).json(book);
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    // admin crud books
    static async addBook(req, res) {
        try {
            const { title, author, description, price, status, content } = req.body;
            
            const book = await Book.create({
                title,
                author,
                description,
                price,
                status,
                content
            })

            res.status(201).json({ message: 'Book added', book })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    static async updateBook(req, res) {
        try {
            const { title, author, description, price, status, content } = req.body;
            const id = req.params.id
            const book = await Book.findByPk(id)

            book.title = title
            book.author = author
            book.description = description
            book.price = price
            book.status = status
            book.content = content
            await book.save();

            res.status(200).json({ message: 'Book updated', book })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    static async deleteBook(req, res) {
        try {
            const id = req.params.id
            const book = await Book.findByPk(id)

            if (!book) return res.status(404).json({ message: 'Book not found' });
            await book.destroy();
            res.status(200).json({ message: 'Book deleted' })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

}

module.exports = bookController