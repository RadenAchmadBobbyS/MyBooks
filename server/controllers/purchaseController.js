const { Purchase, Book } = require('../models');
const midtransClient = require('midtrans-client');

class purchaseController {
    static async createPurchase(req, res) {
        try {
            const { bookId } = req.body;
            const userId = req.user.id;

            const books = await Book.findByPk(bookId);
            if (!books) return res.status(404).json({ message: 'Book not found' })

            let snap = new midtransClient.Snap({
                isProduction: false,
                serverKey: process.env.MIDTRANS_SERVER_KEY
            });

            let parameter = {
                transaction_details: {
                    order_id: `order-${Date.now()}`,
                    gross_amount: Number(books.price)
                },
                customer_details: {
                    email: req.user.email
                }
            };

            const transaction = await snap.createTransaction(parameter);

            const purchase = await Purchase.create({
                userId,
                bookId,
                transactionId: parameter.transaction_details.order_id,
                paymentStatus: 'pending',
                grossAmount: books.price,
                paymentDate: new Date()
            });

            res.status(201).json({
                purchase,
                token: transaction.token,
                redirect_url: transaction.redirect_url
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }   

    static async midtransWebHook(req, res) {
        try {
            console.log("Headers:", req.headers);
            console.log("Parsed JSON:", req.body);

            const { order_id, transaction_status } = req.body

            if (!order_id) {
                return res.status(400).json({ message: "Missing order_id" });
            }

            const purchase = await Purchase.findOne({ where: { transactionId: order_id }});
            if (!purchase) return res.status(404).json({ message: 'Transaction not found'});

            let paymentStatus;

            if (transaction_status === 'settlement' || transaction_status === 'capture') {
                paymentStatus = 'paid'
            } else if (transaction_status === 'expire' || transaction_status === 'cancel') {
                paymentStatus = 'failed'
            } else {
                paymentStatus = 'pending'
            }

            await Purchase.update({ 
                paymentStatus, paymentDate: new Date() 
            }, { where: { transactionId: order_id }});

            res.status(200).json({ message: 'Transaction status updated' })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = purchaseController