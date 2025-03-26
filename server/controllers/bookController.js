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
            const books = await Book.findByPk(id)

            if (!books) return res.status(404).json({ message: 'Book not found' });
            res.status(200).json(books);
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

            const books = await Book.findAll({ where: option });
            res.status(200).json(books);
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    // admin crud books
    static async addBook(req, res) {
        try {
            const { title, author, description, price, status, content, imgUrl } = req.body;
            
            const books = await Book.create({
                title,
                author,
                description,
                price,
                status,
                content,
                imgUrl
            })

            res.status(201).json({ message: 'Book added', books })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    static async updateBook(req, res) {
        try {
            const { title, author, description, price, status, content, imgUrl } = req.body;
            const id = req.params.id
            const books = await Book.findByPk(id)

            if (!books) return res.status(404).json({ message: `Book with ${id} not found`})

            books.title = title
            books.author = author
            books.description = description
            books.price = price
            books.status = status
            books.content = content
            books.imgUrl = imgUrl
            await books.save();

            res.status(200).json({ message: 'Book updated', books })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    static async deleteBook(req, res) {
        try {
            const id = req.params.id
            const books = await Book.findByPk(id)

            if (!books) return res.status(404).json({ message: 'Book not found' });
            await books.destroy();
            res.status(200).json({ message: 'Book deleted' })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

}

module.exports = bookController