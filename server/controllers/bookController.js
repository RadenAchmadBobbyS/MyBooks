const { Book } = require('../models')

class bookController {
    static async getAllBooks(req, res) {
        try {
            const books = await Book.findAll();
            res.status(200).json(books);
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}

module.exports = bookController