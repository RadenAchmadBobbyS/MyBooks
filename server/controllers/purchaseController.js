const { Purchase, Book } = require('../models');
const midtransClient = require('midtrans-client');

class purchaseController {
    static async createPurchase(req, res) {
        try {
            const { bookId } = req.body;
            const userId = req.user.id;

            const book = await Book.findByPk(bookId);
            if (!book) return res.status(404).json({ message: 'Book not found' })

            const purchase = await Purchase.create({
                userId: req.user.id,
                bookId,
                transactionId,
                paymentStatus,
                grossAmount,
                paymentDate: new Date()
            })

            res.status(201).json(purchase);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }   

    static async midtransWebHook(req, res) {
        try {
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = purchaseController