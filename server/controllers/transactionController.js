const { Purchase, User, Book } = require('../models')

class transactionController {
    static async getAllTransactions(req, res) {
        try {
            const transactions = await Purchase.findAll({
                where: { userId: req.user.id},
                include: {
                    model: Book,
                    attributes: ['id', 'title', 'author', 'price']
                },
                order: [['paymentDate', 'DESC']]
            });

            res.status(200).json(transactions);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    static async getTransactionById(req, res) {
        try {
            const transaction = await Purchase.findOne({
                where: { id: req.params.id, userId: req.user.id },
                include: {
                    model: Book,
                    attributes: ['id', 'title', 'author', 'price']
                }
            });

            if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

            res.status(200).json(transaction);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' })
        }
    }

}

module.exports = transactionController